import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import 'express-async-errors';
import { config } from './config/index.js';
import { errorHandler } from './utils/errorHandler.js';
import { generalLimiter } from './middleware/rateLimiter.js';
import { sequelize } from './models/index.js';
import backupScheduler from './cron/BackupScheduler.js';
import logger from './config/logger.js';

// Routes
import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';
import databaseServerRoutes from './routes/databaseServerRoutes.js';
import backupScheduleRoutes from './routes/backupScheduleRoutes.js';
import backupJobRoutes from './routes/backupJobRoutes.js';
import storageProviderRoutes from './routes/storageProviderRoutes.js';

const app = express();

// Middleware
app.use(helmet());
app.use(cors({
  origin: config.frontendUrl,
  credentials: true,
}));
app.use(compression());
app.use(express.json());
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use(generalLimiter);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/database-servers', databaseServerRoutes);
app.use('/api/backup-schedules', backupScheduleRoutes);
app.use('/api/backup-jobs', backupJobRoutes);
app.use('/api/storage-providers', storageProviderRoutes);

// 404 Handler
app.use((req, res) => {
  res.status(404).json({
    status: 'error',
    statusCode: 404,
    message: 'Route not found',
  });
});

// Error Handler
app.use(errorHandler);

// Database and Server Initialization
export async function startServer() {
  try {
    // Authenticate database
    await sequelize.authenticate();
    logger.info('Database connected successfully');

    // Sync database
    await sequelize.sync();
    logger.info('Database synchronized');

    // Initialize backup schedules
    await backupScheduler.initializeSchedules();

    const PORT = config.port || 5000;
    app.listen(PORT, () => {
      logger.info(`Server running on port ${PORT}`);
    });
  } catch (error) {
    logger.error(`Server startup failed: ${error.message}`);
    process.exit(1);
  }
}

export default app;
