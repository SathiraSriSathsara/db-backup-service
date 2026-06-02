import { DataTypes } from 'sequelize';

export default (sequelize) => {
  const Notification = sequelize.define('Notification', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    type: {
      type: DataTypes.ENUM('BACKUP_SUCCESS', 'BACKUP_FAILED', 'RESTORE_SUCCESS', 'RESTORE_FAILED', 'HEALTH_CHECK_FAILED'),
      allowNull: false,
    },
    channel: {
      type: DataTypes.ENUM('EMAIL', 'IN_APP'),
      allowNull: false,
    },
    subject: {
      type: DataTypes.STRING,
    },
    message: {
      type: DataTypes.TEXT,
    },
    isRead: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    isSent: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    sentAt: {
      type: DataTypes.DATE,
    },
  }, {
    tableName: 'notifications',
    timestamps: true,
  });

  Notification.associate = (models) => {
    Notification.belongsTo(models.User, { foreignKey: 'userId' });
    Notification.belongsTo(models.BackupJob, { foreignKey: 'jobId' });
  };

  return Notification;
};
