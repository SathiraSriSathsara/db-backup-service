import jwt from 'jsonwebtoken';
import { config } from '../config/index.js';

export const generateToken = (payload, expiresIn = config.jwtExpire) => {
  return jwt.sign(payload, config.jwtSecret, { expiresIn });
};

export const generateRefreshToken = (payload) => {
  return jwt.sign(payload, config.jwtSecret, { expiresIn: config.refreshTokenExpire });
};

export const verifyToken = (token) => {
  try {
    return jwt.verify(token, config.jwtSecret);
  } catch (error) {
    throw new Error('Invalid or expired token');
  }
};

export const decodeToken = (token) => {
  return jwt.decode(token);
};
