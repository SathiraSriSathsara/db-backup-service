import { databaseServerService } from '../services/databaseServerService.js';
import { asyncHandler } from '../utils/errorHandler.js';

export const databaseServerController = {
  getAll: asyncHandler(async (req, res) => {
    const { page = 1, limit = 10 } = req.query;
    const result = await databaseServerService.getAllServers(page, limit);

    res.json({
      status: 'success',
      data: result,
    });
  }),

  getById: asyncHandler(async (req, res) => {
    const server = await databaseServerService.getServerById(req.params.id);

    res.json({
      status: 'success',
      data: server,
    });
  }),

  create: asyncHandler(async (req, res) => {
    const server = await databaseServerService.createServer(req.body);

    res.status(201).json({
      status: 'success',
      message: 'Database server created successfully',
      data: server,
    });
  }),

  update: asyncHandler(async (req, res) => {
    const server = await databaseServerService.updateServer(req.params.id, req.body);

    res.json({
      status: 'success',
      message: 'Database server updated successfully',
      data: server,
    });
  }),

  delete: asyncHandler(async (req, res) => {
    await databaseServerService.deleteServer(req.params.id);

    res.json({
      status: 'success',
      message: 'Database server deleted successfully',
    });
  }),

  testConnection: asyncHandler(async (req, res) => {
    const result = await databaseServerService.testConnection(req.params.id);

    res.json({
      status: 'success',
      data: result,
    });
  }),
};
