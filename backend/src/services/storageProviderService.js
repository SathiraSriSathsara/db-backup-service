import models from '../models/index.js';
import { AppError } from '../utils/errorHandler.js';

export const storageProviderService = {
  async getAllProviders(page = 1, limit = 10) {
    const offset = (page - 1) * limit;

    const { count, rows } = await models.StorageProvider.findAndCountAll({
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

  async getProviderById(id) {
    const provider = await models.StorageProvider.findByPk(id);

    if (!provider) {
      throw new AppError('Storage provider not found', 404);
    }

    return provider;
  },

  async createProvider(data) {
    const existingProvider = await models.StorageProvider.findOne({
      where: { name: data.name },
    });

    if (existingProvider) {
      throw new AppError('Storage provider with this name already exists', 409);
    }

    // If this is default, remove default from others
    if (data.isDefault) {
      await models.StorageProvider.update(
        { isDefault: false },
        { where: { isDefault: true } },
      );
    }

    const provider = await models.StorageProvider.create(data);
    return provider;
  },

  async updateProvider(id, data) {
    const provider = await models.StorageProvider.findByPk(id);

    if (!provider) {
      throw new AppError('Storage provider not found', 404);
    }

    // If setting as default, remove default from others
    if (data.isDefault && !provider.isDefault) {
      await models.StorageProvider.update(
        { isDefault: false },
        { where: { id: { [models.sequelize.Sequelize.Op.ne]: id } } },
      );
    }

    await provider.update(data);
    return provider;
  },

  async deleteProvider(id) {
    const provider = await models.StorageProvider.findByPk(id);

    if (!provider) {
      throw new AppError('Storage provider not found', 404);
    }

    // Check if provider is used in schedules
    const schedules = await models.BackupSchedule.findOne({
      where: { storageProviderId: id },
    });

    if (schedules) {
      throw new AppError('Cannot delete storage provider in use', 400);
    }

    await provider.destroy();
  },

  async getDefaultProvider() {
    return models.StorageProvider.findOne({
      where: { isDefault: true, isActive: true },
    });
  },
};
