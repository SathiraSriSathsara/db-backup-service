import { DataTypes } from 'sequelize';

export default (sequelize) => {
  const StorageProvider = sequelize.define('StorageProvider', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    type: {
      type: DataTypes.ENUM('LOCAL', 'SFTP', 'S3', 'MINIO'),
      allowNull: false,
    },
    isDefault: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    config: {
      type: DataTypes.JSON,
    },
  }, {
    tableName: 'storage_providers',
    timestamps: true,
  });

  StorageProvider.associate = (models) => {
    StorageProvider.hasMany(models.BackupSchedule, { foreignKey: 'storageProviderId' });
  };

  return StorageProvider;
};
