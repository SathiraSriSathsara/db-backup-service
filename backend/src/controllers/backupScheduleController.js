import { backupScheduleService } from '../services/backupScheduleService.js';
import backupScheduler from '../cron/BackupScheduler.js';
import { asyncHandler } from '../utils/errorHandler.js';

export const backupScheduleController = {
  getAll: asyncHandler(async (req, res) => {
    const page = Math.max(1, parseInt(req.query.page || 1, 10));
    const limit = Math.min(100, Math.max(1, parseInt(req.query.limit || 10, 10)));
    const result = await backupScheduleService.getAllSchedules(page, limit);

    res.json({
      status: 'success',
      data: result,
    });
  }),

  getById: asyncHandler(async (req, res) => {
    const schedule = await backupScheduleService.getScheduleById(req.params.id);

    res.json({
      status: 'success',
      data: schedule,
    });
  }),

  create: asyncHandler(async (req, res) => {
    const schedule = await backupScheduleService.createSchedule(req.body);

    // Schedule the backup
    backupScheduler.scheduleBackup(schedule);

    res.status(201).json({
      status: 'success',
      message: 'Backup schedule created successfully',
      data: schedule,
    });
  }),

  update: asyncHandler(async (req, res) => {
    const schedule = await backupScheduleService.updateSchedule(req.params.id, req.body);

    // Re-schedule the backup
    backupScheduler.scheduleBackup(schedule);

    res.json({
      status: 'success',
      message: 'Backup schedule updated successfully',
      data: schedule,
    });
  }),

  delete: asyncHandler(async (req, res) => {
    await backupScheduleService.deleteSchedule(req.params.id);

    // Remove from scheduler
    backupScheduler.removeSchedule(req.params.id);

    res.json({
      status: 'success',
      message: 'Backup schedule deleted successfully',
    });
  }),

  toggle: asyncHandler(async (req, res) => {
    const { isActive } = req.body;
    const schedule = await backupScheduleService.toggleSchedule(req.params.id, isActive);

    // Update scheduler
    backupScheduler.toggleSchedule(req.params.id, isActive);

    res.json({
      status: 'success',
      message: isActive ? 'Schedule enabled' : 'Schedule disabled',
      data: schedule,
    });
  }),
};
