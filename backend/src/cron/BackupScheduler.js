import cron from 'node-cron';
import models from '../models/index.js';
import { BackupEngine } from '../backup/BackupEngine.js';
import { CompressionService } from '../backup/CompressionService.js';
import { EncryptionService } from '../backup/EncryptionService.js';
import { StorageFactory } from '../storage/StorageFactory.js';
import logger from '../config/logger.js';

class BackupScheduler {
  constructor() {
    this.jobs = new Map();
  }

  async initializeSchedules() {
    try {
      const schedules = await models.BackupSchedule.findAll({
        where: { isActive: true },
        include: [
          { model: models.DatabaseServer },
          { model: models.StorageProvider },
        ],
      });

      for (const schedule of schedules) {
        this.scheduleBackup(schedule);
      }

      logger.info(`Initialized ${schedules.length} backup schedules`);
    } catch (error) {
      logger.error(`Failed to initialize schedules: ${error.message}`);
    }
  }

  scheduleBackup(schedule) {
    const scheduleKey = schedule.id;

    // Remove existing job if any
    if (this.jobs.has(scheduleKey)) {
      this.jobs.get(scheduleKey).stop();
      this.jobs.delete(scheduleKey);
    }

    let cronExpression = schedule.cronExpression;

    if (!cronExpression) {
      const timeNow = new Date();
      const time = `${timeNow.getHours()}:${timeNow.getMinutes()}`;
      cronExpression = this.generateCronExpression(schedule.frequency, time);
    }

    try {
      const task = cron.schedule(cronExpression, async () => {
        await this.executeBackup(schedule);
      });

      this.jobs.set(scheduleKey, task);
      logger.info(`Scheduled backup: ${schedule.name} with expression: ${cronExpression}`);
    } catch (error) {
      logger.error(`Failed to schedule backup ${schedule.name}: ${error.message}`);
    }
  }

  generateCronExpression(frequency, time = '01:00') {
    const [hours, minutes] = time.split(':');

    const crons = {
      EVERY_MINUTE: '* * * * *',
      HOURLY: `${minutes} * * * *`,
      DAILY: `${minutes} ${hours} * * *`,
      WEEKLY: `${minutes} ${hours} * * 1`,
      MONTHLY: `${minutes} ${hours} 1 * *`,
    };

    return crons[frequency] || '0 1 * * *'; // Default to 1 AM daily
  }

  async executeBackup(schedule) {
    let job = null;

    try {
      logger.info(`Starting backup: ${schedule.name}`);

      // Create backup job record
      job = await models.BackupJob.create({
        scheduleId: schedule.id,
        serverId: schedule.serverId,
        status: 'RUNNING',
        isManual: false,
      });

      const server = schedule.DatabaseServer;
      const storageProvider = schedule.StorageProvider;

      // Initialize backup engine
      const backupEngine = new BackupEngine(server);
      const backupFilePath = await backupEngine.backup();

      let finalPath = backupFilePath;
      let isCompressed = false;
      let isEncrypted = false;

      // Compression
      if (schedule.compression) {
        const compressedPath = `${backupFilePath}.gz`;
        await CompressionService.compressFile(backupFilePath, compressedPath);
        finalPath = compressedPath;
        isCompressed = true;
      }

      // Encryption
      if (schedule.encryption) {
        const encryptedPath = `${finalPath}.enc`;
        await EncryptionService.encryptFile(finalPath, encryptedPath);
        finalPath = encryptedPath;
        isEncrypted = true;
      }

      // Get file info
      const fileSize = await backupEngine.getBackupSize(finalPath);
      const checksum = await backupEngine.getBackupChecksum(finalPath);

      // Upload to storage
      const storage = StorageFactory.createStorage(storageProvider);
      const fileName = `${schedule.fileNamingPattern
        .replace('{database}', server.database)
        .replace('{timestamp}', Date.now())}${isCompressed ? '.gz' : ''}${
        isEncrypted ? '.enc' : ''
      }`;
      const storagePath = await storage.upload(finalPath, fileName);

      // Create backup file record
      await models.BackupFile.create({
        jobId: job.id,
        fileName,
        fileSize,
        checksum,
        isCompressed,
        isEncrypted,
        storageProvider: storageProvider.type,
        storagePath,
      });

      // Update job
      await job.update({
        status: 'COMPLETED',
        fileName,
        fileSize,
        endTime: new Date(),
      });

      // Update schedule
      schedule.lastRun = new Date();
      schedule.nextRun = new Date(Date.now() + 24 * 60 * 60 * 1000); // Next run 24h later
      await schedule.save();

      logger.info(`Backup completed: ${schedule.name}`);
    } catch (error) {
      logger.error(`Backup failed: ${error.message}`);

      if (job) {
        await job.update({
          status: 'FAILED',
          errorMessage: error.message,
          endTime: new Date(),
        });
      }

      // Send notification
      await this.sendNotification(schedule, 'BACKUP_FAILED', error.message);
    }
  }

  async sendNotification(schedule, type, message) {
    try {
      // Find admin users
      const admins = await models.User.findAll({
        include: [
          {
            model: models.Role,
            where: { name: ['SUPER_ADMIN', 'ADMIN'] },
          },
        ],
      });

      for (const admin of admins) {
        await models.Notification.create({
          userId: admin.id,
          type,
          channel: 'IN_APP',
          subject: `Backup ${type === 'BACKUP_FAILED' ? 'Failed' : 'Completed'}: ${schedule.name}`,
          message: `${schedule.name} backup ${type === 'BACKUP_FAILED' ? 'failed' : 'completed'} with message: ${message}`,
        });
      }
    } catch (error) {
      logger.error(`Failed to send notification: ${error.message}`);
    }
  }

  toggleSchedule(scheduleId, isActive) {
    const scheduleKey = scheduleId;

    if (isActive) {
      // Resume schedule - fetch and reschedule
      models.BackupSchedule.findByPk(scheduleId).then((schedule) => {
        this.scheduleBackup(schedule);
      });
    } else {
      // Pause schedule
      if (this.jobs.has(scheduleKey)) {
        this.jobs.get(scheduleKey).stop();
        this.jobs.delete(scheduleKey);
        logger.info(`Paused backup schedule: ${scheduleId}`);
      }
    }
  }

  removeSchedule(scheduleId) {
    const scheduleKey = scheduleId;

    if (this.jobs.has(scheduleKey)) {
      this.jobs.get(scheduleKey).stop();
      this.jobs.delete(scheduleKey);
      logger.info(`Removed backup schedule: ${scheduleId}`);
    }
  }
}

export default new BackupScheduler();
