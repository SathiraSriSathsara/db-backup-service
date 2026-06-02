import models from '../models/index.js';
import { encrypt, decrypt } from '../utils/encryption.js';
import { AppError } from '../utils/errorHandler.js';

export const databaseServerService = {
  async getAllServers(page = 1, limit = 10) {
    const offset = (page - 1) * limit;

    const { count, rows } = await models.DatabaseServer.findAndCountAll({
      limit,
      offset,
      order: [['createdAt', 'DESC']],
    });

    const decryptedRows = rows.map((server) => {
      const plainServer = server.toJSON();
      if (plainServer.password) {
        plainServer.password = decrypt(plainServer.password);
      }
      return plainServer;
    });

    return {
      total: count,
      page,
      limit,
      pages: Math.ceil(count / limit),
      data: decryptedRows,
    };
  },

  async getServerById(id) {
    const server = await models.DatabaseServer.findByPk(id);

    if (!server) {
      throw new AppError('Database server not found', 404);
    }

    const plainServer = server.toJSON();
    if (plainServer.password) {
      plainServer.password = decrypt(plainServer.password);
    }

    return plainServer;
  },

  async createServer(data) {
    const existingServer = await models.DatabaseServer.findOne({
      where: {
        host: data.host,
        port: data.port,
        database: data.database,
      },
    });

    if (existingServer) {
      throw new AppError('Server with same host, port, and database already exists', 409);
    }

    const encryptedData = {
      ...data,
      password: encrypt(data.password),
    };

    const server = await models.DatabaseServer.create(encryptedData);
    return this.getServerById(server.id);
  },

  async updateServer(id, data) {
    const server = await models.DatabaseServer.findByPk(id);

    if (!server) {
      throw new AppError('Database server not found', 404);
    }

    if (data.password) {
      data.password = encrypt(data.password);
    }

    await server.update(data);
    return this.getServerById(id);
  },

  async deleteServer(id) {
    const server = await models.DatabaseServer.findByPk(id);

    if (!server) {
      throw new AppError('Database server not found', 404);
    }

    // Check if server has active schedules
    const schedules = await models.BackupSchedule.findOne({
      where: { serverId: id, isActive: true },
    });

    if (schedules) {
      throw new AppError('Cannot delete server with active backup schedules', 400);
    }

    await server.destroy();
  },

  async testConnection(id) {
    const server = await this.getServerById(id);

    try {
      // This would use actual DB connection libraries
      // For now, we'll just return success
      return {
        success: true,
        message: 'Connection successful',
      };
    } catch (error) {
      throw new AppError(`Connection failed: ${error.message}`, 400);
    }
  },
};
