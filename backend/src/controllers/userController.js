import { userService } from '../services/userService.js';
import { asyncHandler } from '../utils/errorHandler.js';

export const userController = {
  getAll: asyncHandler(async (req, res) => {
    const page = Math.max(1, parseInt(req.query.page || 1, 10));
    const limit = Math.min(100, Math.max(1, parseInt(req.query.limit || 10, 10)));
    const result = await userService.getAllUsers(page, limit);

    res.json({
      status: 'success',
      data: result,
    });
  }),

  getById: asyncHandler(async (req, res) => {
    const user = await userService.getUserById(req.params.id);

    res.json({
      status: 'success',
      data: user,
    });
  }),

  update: asyncHandler(async (req, res) => {
    const user = await userService.updateUser(req.params.id, req.body);

    res.json({
      status: 'success',
      message: 'User updated successfully',
      data: user,
    });
  }),

  delete: asyncHandler(async (req, res) => {
    await userService.deleteUser(req.params.id);

    res.json({
      status: 'success',
      message: 'User deleted successfully',
    });
  }),

  changePassword: asyncHandler(async (req, res) => {
    const { currentPassword, newPassword } = req.body;
    await userService.changePassword(req.user.id, currentPassword, newPassword);

    res.json({
      status: 'success',
      message: 'Password changed successfully',
    });
  }),
};
