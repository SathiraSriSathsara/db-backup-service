import models from '../models/index.js';
import { AppError } from '../utils/errorHandler.js';

export const backupJobService = {
  async getAllJobs(page = 1, limit = 10, filters = {}) {
    const offset = (page - 1) * limit;
    const where = {};

    if (filters.serverId) where.serverId = filters.serverId;
    if (filters.status) where.status = filters.status;

    const { count, rows } = await models.BackupJob.findAndCountAll({
      where,
      include: [
        { model: models.DatabaseServer },
        { model: models.BackupSchedule },
        { model: models.BackupFile },
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

  async getJobById(id) {
    const job = await models.BackupJob.findByPk(id, {
      include: [
        { model: models.DatabaseServer },
        { model: models.BackupSchedule },
        { model: models.BackupFile },
      ],
    });

    if (!job) {
      throw new AppError('Backup job not found', 404);
    }

    return job;
  },

  async createJob(data) {
    const job = await models.BackupJob.create(data);
    return this.getJobById(job.id);
  },

  async updateJobStatus(id, status, errorMessage = null) {
    const job = await models.BackupJob.findByPk(id);

    if (!job) {
      throw new AppError('Backup job not found', 404);
    }

    job.status = status;
    if (errorMessage) job.errorMessage = errorMessage;
    if (status === 'RUNNING') job.startTime = new Date();
    if (status === 'COMPLETED' || status === 'FAILED') {
      job.endTime = new Date();
      job.duration = Math.floor((job.endTime - job.startTime) / 1000);
    }

    await job.save();
    return job;
  },

  async deleteJob(id) {
    const job = await models.BackupJob.findByPk(id);

    if (!job) {
      throw new AppError('Backup job not found', 404);
    }

    // Delete associated files
    await models.BackupFile.destroy({ where: { jobId: id } });
    await job.destroy();
  },

  async getJobsByServer(serverId, page = 1, limit = 10) {
    const offset = (page - 1) * limit;

    const { count, rows } = await models.BackupJob.findAndCountAll({
      where: { serverId },
      include: [{ model: models.BackupFile }],
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
};
