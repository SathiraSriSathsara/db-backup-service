import { DataTypes } from 'sequelize';

export default (sequelize) => {
  const AuditLog = sequelize.define('AuditLog', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    action: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    module: {
      type: DataTypes.ENUM('AUTH', 'USER', 'SERVER', 'BACKUP', 'RESTORE', 'STORAGE', 'NOTIFICATION'),
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
    },
    ipAddress: {
      type: DataTypes.STRING,
    },
    userAgent: {
      type: DataTypes.TEXT,
    },
    oldValues: {
      type: DataTypes.JSON,
    },
    newValues: {
      type: DataTypes.JSON,
    },
    status: {
      type: DataTypes.ENUM('SUCCESS', 'FAILED'),
      defaultValue: 'SUCCESS',
    },
  }, {
    tableName: 'audit_logs',
    timestamps: true,
  });

  AuditLog.associate = (models) => {
    AuditLog.belongsTo(models.User, { foreignKey: 'userId' });
  };

  return AuditLog;
};
