import models from '../models/index.js';
import { AppError } from '../utils/errorHandler.js';

export const backupScheduleService = {
  async getAllSchedules(page = 1, limit = 10) {
    const offset = (page - 1) * limit;

    const { count, rows } = await models.BackupSchedule.findAndCountAll({
      include: [
        { model: models.DatabaseServer },
        { model: models.StorageProvider },
      ],
      limit,
      offset,
      order: [['createdAt', 'DESC']],
    });

    return {
      total: count,
      page,
      limit,
      pages: Math.ceil(count / limit),
      data: rows,
    };
  },

  async getScheduleById(id) {
    const schedule = await models.BackupSchedule.findByPk(id, {
      include: [
        { model: models.DatabaseServer },
        { model: models.StorageProvider },
      ],
    });

    if (!schedule) {
      throw new AppError('Backup schedule not found', 404);
    }

    return schedule;
  },

  async createSchedule(data) {
    // Verify server and storage provider exist
    const server = await models.DatabaseServer.findByPk(data.serverId);
    if (!server) {
      throw new AppError('Database server not found', 404);
    }

    const storageProvider = await models.StorageProvider.findByPk(data.storageProviderId);
    if (!storageProvider) {
      throw new AppError('Storage provider not found', 404);
    }

    const schedule = await models.BackupSchedule.create(data);
    return this.getScheduleById(schedule.id);
  },

  async updateSchedule(id, data) {
    const schedule = await models.BackupSchedule.findByPk(id);

    if (!schedule) {
      throw new AppError('Backup schedule not found', 404);
    }

    await schedule.update(data);
    return this.getScheduleById(id);
  },

  async deleteSchedule(id) {
    const schedule = await models.BackupSchedule.findByPk(id);

    if (!schedule) {
      throw new AppError('Backup schedule not found', 404);
    }

    await schedule.destroy();
  },

  async toggleSchedule(id, isActive) {
    const schedule = await models.BackupSchedule.findByPk(id);

    if (!schedule) {
      throw new AppError('Backup schedule not found', 404);
    }

    schedule.isActive = isActive;
    await schedule.save();

    return schedule;
  },

  async getActiveSchedules() {
    return models.BackupSchedule.findAll({
      where: { isActive: true },
      include: [
        { model: models.DatabaseServer },
        { model: models.StorageProvider },
      ],
    });
  },
};
