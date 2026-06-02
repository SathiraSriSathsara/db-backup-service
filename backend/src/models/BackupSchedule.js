import { DataTypes } from 'sequelize';

export default (sequelize) => {
  const BackupSchedule = sequelize.define('BackupSchedule', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    frequency: {
      type: DataTypes.ENUM('EVERY_MINUTE', 'HOURLY', 'DAILY', 'WEEKLY', 'MONTHLY', 'CUSTOM'),
      allowNull: false,
    },
    cronExpression: {
      type: DataTypes.STRING,
    },
    retentionDays: {
      type: DataTypes.INTEGER,
      defaultValue: 30,
    },
    compression: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    encryption: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    fileNamingPattern: {
      type: DataTypes.STRING,
      defaultValue: '{database}_{timestamp}.sql',
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    lastRun: {
      type: DataTypes.DATE,
    },
    nextRun: {
      type: DataTypes.DATE,
    },
  }, {
    tableName: 'backup_schedules',
    timestamps: true,
  });

  BackupSchedule.associate = (models) => {
    BackupSchedule.belongsTo(models.DatabaseServer, { foreignKey: 'serverId' });
    BackupSchedule.belongsTo(models.StorageProvider, { foreignKey: 'storageProviderId' });
    BackupSchedule.hasMany(models.BackupJob, { foreignKey: 'scheduleId' });
  };

  return BackupSchedule;
};
