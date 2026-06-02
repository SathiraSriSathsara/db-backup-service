import { storageProviderService } from '../services/storageProviderService.js';
import { asyncHandler } from '../utils/errorHandler.js';

export const storageProviderController = {
  getAll: asyncHandler(async (req, res) => {
    const { page = 1, limit = 10 } = req.query;
    const result = await storageProviderService.getAllProviders(page, limit);

    res.json({
      status: 'success',
      data: result,
    });
  }),

  getById: asyncHandler(async (req, res) => {
    const provider = await storageProviderService.getProviderById(req.params.id);

    res.json({
      status: 'success',
      data: provider,
    });
  }),

  create: asyncHandler(async (req, res) => {
    const provider = await storageProviderService.createProvider(req.body);

    res.status(201).json({
      status: 'success',
      message: 'Storage provider created successfully',
      data: provider,
    });
  }),

  update: asyncHandler(async (req, res) => {
    const provider = await storageProviderService.updateProvider(req.params.id, req.body);

    res.json({
      status: 'success',
      message: 'Storage provider updated successfully',
      data: provider,
    });
  }),

  delete: asyncHandler(async (req, res) => {
    await storageProviderService.deleteProvider(req.params.id);

    res.json({
      status: 'success',
      message: 'Storage provider deleted successfully',
    });
  }),
};
