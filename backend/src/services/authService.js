import models from '../models/index.js';
import { generateToken, generateRefreshToken } from '../utils/jwt.js';
import { generateRandomToken, hashToken } from '../utils/helpers.js';
import { sendEmail } from '../config/mail.js';
import { AppError } from '../utils/errorHandler.js';

export const authService = {
  async login(email, password, ipAddress, userAgent) {
    const user = await models.User.findOne({
      where: { email },
      include: [{ model: models.Role }],
    });

    if (!user || !user.validatePassword(password)) {
      throw new AppError('Invalid credentials', 401);
    }

    if (!user.isActive) {
      throw new AppError('User account is inactive', 403);
    }

    const token = generateToken({ id: user.id, email: user.email });
    const refreshToken = generateRefreshToken({ id: user.id });

    await models.UserSession.create({
      userId: user.id,
      token,
      refreshToken,
      ipAddress,
      userAgent,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
    });

    user.lastLogin = new Date();
    await user.save();

    return {
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.Role.name,
      },
      token,
      refreshToken,
    };
  },

  async register(data) {
    const user = await models.User.create({
      email: data.email,
      firstName: data.firstName,
      lastName: data.lastName,
      password: data.password,
      roleId: 3, // VIEWER role by default
    });

    const verificationToken = generateRandomToken();
    user.emailVerificationToken = hashToken(verificationToken);
    user.emailVerificationExpires = new Date(Date.now() + 24 * 60 * 60 * 1000);
    await user.save();

    await sendEmail(
      user.email,
      'Email Verification',
      `<p>Please verify your email by clicking <a href="${process.env.FRONTEND_URL}/verify-email/${verificationToken}">here</a></p>`,
    );

    return user;
  },

  async logout(sessionId) {
    await models.UserSession.update(
      { isActive: false },
      { where: { id: sessionId } },
    );
  },

  async refreshToken(refreshToken) {
    const session = await models.UserSession.findOne({
      where: { refreshToken, isActive: true },
    });

    if (!session) {
      throw new AppError('Invalid refresh token', 401);
    }

    const user = await models.User.findByPk(session.userId);
    const newToken = generateToken({ id: user.id, email: user.email });

    return { token: newToken };
  },

  async requestPasswordReset(email) {
    const user = await models.User.findOne({ where: { email } });

    if (!user) {
      throw new AppError('User not found', 404);
    }

    const resetToken = generateRandomToken();
    user.passwordResetToken = hashToken(resetToken);
    user.passwordResetExpires = new Date(Date.now() + 60 * 60 * 1000); // 1 hour
    await user.save();

    await sendEmail(
      user.email,
      'Password Reset',
      `<p>Reset your password by clicking <a href="${process.env.FRONTEND_URL}/reset-password/${resetToken}">here</a></p>`,
    );
  },

  async resetPassword(resetToken, newPassword) {
    const tokenHash = hashToken(resetToken);
    const user = await models.User.findOne({
      where: {
        passwordResetToken: tokenHash,
        passwordResetExpires: { [models.sequelize.Sequelize.Op.gt]: new Date() },
      },
    });

    if (!user) {
      throw new AppError('Invalid or expired reset token', 400);
    }

    user.password = newPassword;
    user.passwordResetToken = null;
    user.passwordResetExpires = null;
    await user.save();
  },
};
