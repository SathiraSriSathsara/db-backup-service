import { Sequelize } from 'sequelize';
import dbConfig from '../config/database.js';
import roleModel from './Role.js';
import userModel from './User.js';
import userSessionModel from './UserSession.js';
import databaseServerModel from './DatabaseServer.js';
import backupScheduleModel from './BackupSchedule.js';
import backupJobModel from './BackupJob.js';
import backupFileModel from './BackupFile.js';
import storageProviderModel from './StorageProvider.js';
import notificationModel from './Notification.js';
import auditLogModel from './AuditLog.js';

const env = process.env.NODE_ENV || 'development';
const config = dbConfig[env];

const sequelize = new Sequelize(
  config.database,
  config.username,
  config.password,
  config,
);

const models = {
  Role: roleModel(sequelize),
  User: userModel(sequelize),
  UserSession: userSessionModel(sequelize),
  DatabaseServer: databaseServerModel(sequelize),
  BackupSchedule: backupScheduleModel(sequelize),
  BackupJob: backupJobModel(sequelize),
  BackupFile: backupFileModel(sequelize),
  StorageProvider: storageProviderModel(sequelize),
  Notification: notificationModel(sequelize),
  AuditLog: auditLogModel(sequelize),
};

// Create associations
Object.values(models).forEach((model) => {
  if (model.associate) {
    model.associate(models);
  }
});

export { sequelize };
export default models;
