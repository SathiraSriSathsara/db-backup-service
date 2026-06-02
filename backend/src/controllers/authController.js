import { authService } from '../services/authService.js';
import { asyncHandler } from '../utils/errorHandler.js';

export const authController = {
  register: asyncHandler(async (req, res) => {
    const user = await authService.register(req.body);

    res.status(201).json({
      status: 'success',
      message: 'User registered successfully. Please verify your email.',
      data: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
      },
    });
  }),

  login: asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    const ipAddress = req.ip;
    const userAgent = req.headers['user-agent'];

    const result = await authService.login(email, password, ipAddress, userAgent);

    res.json({
      status: 'success',
      message: 'Login successful',
      data: result,
    });
  }),

  logout: asyncHandler(async (req, res) => {
    const sessionId = req.user.sessionId;
    await authService.logout(sessionId);

    res.json({
      status: 'success',
      message: 'Logout successful',
    });
  }),

  refreshToken: asyncHandler(async (req, res) => {
    const { refreshToken } = req.body;
    const result = await authService.refreshToken(refreshToken);

    res.json({
      status: 'success',
      message: 'Token refreshed',
      data: result,
    });
  }),

  requestPasswordReset: asyncHandler(async (req, res) => {
    const { email } = req.body;
    await authService.requestPasswordReset(email);

    res.json({
      status: 'success',
      message: 'Password reset email sent',
    });
  }),

  resetPassword: asyncHandler(async (req, res) => {
    const { token, password } = req.body;
    await authService.resetPassword(token, password);

    res.json({
      status: 'success',
      message: 'Password reset successful',
    });
  }),
};
