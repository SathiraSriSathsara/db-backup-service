import { body, param, query, validationResult } from 'express-validator';
import { AppError } from '../utils/errorHandler.js';

export const validateRequest = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const message = errors.array().map((e) => e.msg).join(', ');
    return next(new AppError(message, 400));
  }
  next();
};

// Auth validations
export const validateLogin = [
  body('email').isEmail().withMessage('Invalid email'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
];

export const validateRegister = [
  body('email').isEmail().withMessage('Invalid email'),
  body('firstName').notEmpty().withMessage('First name is required'),
  body('lastName').notEmpty().withMessage('Last name is required'),
  body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters'),
];

// Database server validations
export const validateDatabaseServer = [
  body('name').notEmpty().withMessage('Name is required'),
  body('type').isIn(['MySQL', 'PostgreSQL', 'MongoDB', 'MariaDB']).withMessage('Invalid database type'),
  body('host').notEmpty().withMessage('Host is required'),
  body('port').isInt({ min: 1, max: 65535 }).withMessage('Invalid port number'),
  body('username').notEmpty().withMessage('Username is required'),
  body('password').notEmpty().withMessage('Password is required'),
];

// Backup schedule validations
export const validateBackupSchedule = [
  body('name').notEmpty().withMessage('Name is required'),
  body('frequency')
    .isIn(['EVERY_MINUTE', 'HOURLY', 'DAILY', 'WEEKLY', 'MONTHLY', 'CUSTOM'])
    .withMessage('Invalid frequency'),
  body('serverId').isUUID().withMessage('Invalid server ID'),
  body('storageProviderId').isUUID().withMessage('Invalid storage provider ID'),
  body('retentionDays').isInt({ min: 1 }).withMessage('Retention days must be positive'),
];

// Storage provider validations
export const validateStorageProvider = [
  body('name').notEmpty().withMessage('Name is required'),
  body('type').isIn(['LOCAL', 'SFTP', 'S3', 'MINIO']).withMessage('Invalid storage type'),
  body('config').isObject().withMessage('Config must be an object'),
];
