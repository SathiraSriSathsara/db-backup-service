import { DataTypes } from 'sequelize';

export default (sequelize) => {
  const DatabaseServer = sequelize.define('DatabaseServer', {
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
      type: DataTypes.ENUM('MySQL', 'PostgreSQL', 'MongoDB', 'MariaDB'),
      allowNull: false,
    },
    host: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    port: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    database: {
      type: DataTypes.STRING,
    },
    username: {
      type: DataTypes.STRING,
    },
    password: {
      type: DataTypes.TEXT,
    },
    ssl: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    sslCertificate: {
      type: DataTypes.TEXT,
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    description: {
      type: DataTypes.TEXT,
    },
    lastHealthCheck: {
      type: DataTypes.DATE,
    },
    isHealthy: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  }, {
    tableName: 'database_servers',
    timestamps: true,
  });

  DatabaseServer.associate = (models) => {
    DatabaseServer.hasMany(models.BackupSchedule, { foreignKey: 'serverId' });
    DatabaseServer.hasMany(models.BackupJob, { foreignKey: 'serverId' });
  };

  return DatabaseServer;
};
