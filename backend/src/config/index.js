export const config = {
  jwtSecret: process.env.JWT_SECRET || 'your-secret-key-change-in-production',
  jwtExpire: process.env.JWT_EXPIRE || '7d',
  refreshTokenExpire: process.env.REFRESH_TOKEN_EXPIRE || '30d',
  encryptionKey: process.env.ENCRYPTION_KEY || 'your-encryption-key-32-chars-long!!',
  nodeEnv: process.env.NODE_ENV || 'development',
  port: process.env.PORT || 5000,
  apiUrl: process.env.API_URL || 'http://localhost:5000',
  frontendUrl: process.env.FRONTEND_URL || 'http://localhost:4173',
  redisUrl: process.env.REDIS_URL || 'redis://localhost:6379',
  maxFileSize: 5 * 1024 * 1024 * 1024, // 5GB
  backupDir: process.env.BACKUP_DIR || './backups',
  logLevel: process.env.LOG_LEVEL || 'info',
  rateLimitWindowMs: 15 * 60 * 1000, // 15 minutes
  rateLimitMaxRequests: 100,
};
