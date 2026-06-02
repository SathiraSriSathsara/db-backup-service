import { verifyToken } from '../utils/jwt.js';
import models from '../models/index.js';
import { AppError } from '../utils/errorHandler.js';

export const authenticate = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      throw new AppError('No token provided', 401);
    }

    const decoded = verifyToken(token);
    const user = await models.User.findByPk(decoded.id, {
      include: [{ model: models.Role }],
    });

    if (!user || !user.isActive) {
      throw new AppError('User not found or inactive', 401);
    }

    req.user = user;
    next();
  } catch (error) {
    next(error);
  }
};

export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return next(new AppError('User not authenticated', 401));
    }

    if (!roles.includes(req.user.Role.name)) {
      return next(new AppError('Insufficient permissions', 403));
    }

    next();
  };
};

export const optionalAuth = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];

    if (token) {
      const decoded = verifyToken(token);
      const user = await models.User.findByPk(decoded.id);
      req.user = user;
    }

    next();
  } catch (error) {
    next();
  }
};
