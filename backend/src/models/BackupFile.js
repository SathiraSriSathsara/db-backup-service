import { DataTypes } from 'sequelize';

export default (sequelize) => {
  const BackupFile = sequelize.define('BackupFile', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    fileName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    fileSize: {
      type: DataTypes.BIGINT,
    },
    filePath: {
      type: DataTypes.TEXT,
    },
    checksum: {
      type: DataTypes.STRING,
    },
    isEncrypted: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    isCompressed: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    storageProvider: {
      type: DataTypes.ENUM('LOCAL', 'SFTP', 'S3', 'MINIO'),
    },
    storagePath: {
      type: DataTypes.TEXT,
    },
  }, {
    tableName: 'backup_files',
    timestamps: true,
  });

  BackupFile.associate = (models) => {
    BackupFile.belongsTo(models.BackupJob, { foreignKey: 'jobId' });
  };

  return BackupFile;
};
