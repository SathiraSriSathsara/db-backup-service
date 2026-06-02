import models from '../models/index.js';
import { AppError } from '../utils/errorHandler.js';

export const userService = {
  async getAllUsers(page = 1, limit = 10) {
    const offset = (page - 1) * limit;

    const { count, rows } = await models.User.findAndCountAll({
      include: [{ model: models.Role }],
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

  async getUserById(id) {
    const user = await models.User.findByPk(id, {
      include: [{ model: models.Role }],
    });

    if (!user) {
      throw new AppError('User not found', 404);
    }

    return user;
  },

  async updateUser(id, data) {
    const user = await models.User.findByPk(id);

    if (!user) {
      throw new AppError('User not found', 404);
    }

    if (data.email) {
      const existingUser = await models.User.findOne({
        where: { email: data.email, id: { [models.sequelize.Sequelize.Op.ne]: id } },
      });
      if (existingUser) {
        throw new AppError('Email already in use', 409);
      }
    }

    Object.assign(user, data);
    await user.save();

    return user;
  },

  async deleteUser(id) {
    const user = await models.User.findByPk(id);

    if (!user) {
      throw new AppError('User not found', 404);
    }

    await user.destroy();
  },

  async changePassword(userId, currentPassword, newPassword) {
    const user = await models.User.findByPk(userId);

    if (!user) {
      throw new AppError('User not found', 404);
    }

    if (!user.validatePassword(currentPassword)) {
      throw new AppError('Current password is incorrect', 400);
    }

    user.password = newPassword;
    await user.save();
  },
};
