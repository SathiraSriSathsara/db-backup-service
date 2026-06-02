import { backupJobService } from '../services/backupJobService.js';
import { asyncHandler } from '../utils/errorHandler.js';

export const backupJobController = {
  getAll: asyncHandler(async (req, res) => {
    const page = Math.max(1, parseInt(req.query.page || 1, 10));
    const limit = Math.min(100, Math.max(1, parseInt(req.query.limit || 10, 10)));
    const { serverId, status } = req.query;
    const filters = { serverId, status };

    const result = await backupJobService.getAllJobs(page, limit, filters);

    res.json({
      status: 'success',
      data: result,
    });
  }),

  getById: asyncHandler(async (req, res) => {
    const job = await backupJobService.getJobById(req.params.id);

    res.json({
      status: 'success',
      data: job,
    });
  }),

  getByServer: asyncHandler(async (req, res) => {
    const page = Math.max(1, parseInt(req.query.page || 1, 10));
    const limit = Math.min(100, Math.max(1, parseInt(req.query.limit || 10, 10)));
    const result = await backupJobService.getJobsByServer(req.params.serverId, page, limit);

    res.json({
      status: 'success',
      data: result,
    });
  }),

  delete: asyncHandler(async (req, res) => {
    await backupJobService.deleteJob(req.params.id);

    res.json({
      status: 'success',
      message: 'Backup job deleted successfully',
    });
  }),
};
