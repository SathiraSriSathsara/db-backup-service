import { DataTypes } from 'sequelize';

export default (sequelize) => {
  const BackupJob = sequelize.define('BackupJob', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    status: {
      type: DataTypes.ENUM('PENDING', 'RUNNING', 'COMPLETED', 'FAILED'),
      defaultValue: 'PENDING',
    },
    startTime: {
      type: DataTypes.DATE,
    },
    endTime: {
      type: DataTypes.DATE,
    },
    duration: {
      type: DataTypes.INTEGER, // in seconds
    },
    fileSize: {
      type: DataTypes.BIGINT,
    },
    fileName: {
      type: DataTypes.STRING,
    },
    errorMessage: {
      type: DataTypes.TEXT,
    },
    retryCount: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    isManual: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  }, {
    tableName: 'backup_jobs',
    timestamps: true,
  });

  BackupJob.associate = (models) => {
    BackupJob.belongsTo(models.DatabaseServer, { foreignKey: 'serverId' });
    BackupJob.belongsTo(models.BackupSchedule, { foreignKey: 'scheduleId' });
    BackupJob.hasMany(models.BackupFile, { foreignKey: 'jobId' });
  };

  return BackupJob;
};
