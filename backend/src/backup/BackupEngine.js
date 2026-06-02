import { exec } from 'child_process';
import { promisify } from 'util';
import fs from 'fs';
import path from 'path';
import gzip from 'gzip-size';
import { decrypt } from '../utils/encryption.js';
import { calculateFileChecksum } from '../utils/helpers.js';

const execAsync = promisify(exec);

export class BackupEngine {
  constructor(server) {
    this.server = server;
    this.type = server.type;
  }

  async backup(options = {}) {
    const backupDir = process.env.BACKUP_DIR || './backups';
    const fileName = `${this.server.database}_${Date.now()}.sql`;
    const filePath = path.join(backupDir, fileName);

    try {
      switch (this.type) {
        case 'MySQL':
        case 'MariaDB':
          await this.backupMySQL(filePath, options);
          break;
        case 'PostgreSQL':
          await this.backupPostgreSQL(filePath, options);
          break;
        case 'MongoDB':
          await this.backupMongoDB(filePath, options);
          break;
        default:
          throw new Error(`Unsupported database type: ${this.type}`);
      }

      return filePath;
    } catch (error) {
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
      throw error;
    }
  }

  async backupMySQL(filePath, options) {
    const password = decrypt(this.server.password);
    const command = [
      'mysqldump',
      `-h${this.server.host}`,
      `-P${this.server.port}`,
      `-u${this.server.username}`,
      `-p${password}`,
      '--opt',
      '--add-drop-table',
      '--add-locks',
      '--single-transaction',
      this.server.database,
      `> ${filePath}`,
    ].join(' ');

    try {
      await execAsync(command);
    } catch (error) {
      throw new Error(`MySQL backup failed: ${error.message}`);
    }
  }

  async backupPostgreSQL(filePath, options) {
    const password = decrypt(this.server.password);
    const command = [
      `PGPASSWORD="${password}"`,
      'pg_dump',
      `-h${this.server.host}`,
      `-p${this.server.port}`,
      `-U${this.server.username}`,
      '-F',
      'c',
      this.server.database,
      `> ${filePath}`,
    ].join(' ');

    try {
      await execAsync(command);
    } catch (error) {
      throw new Error(`PostgreSQL backup failed: ${error.message}`);
    }
  }

  async backupMongoDB(filePath, options) {
    const password = decrypt(this.server.password);
    const command = [
      'mongodump',
      `--host=${this.server.host}:${this.server.port}`,
      `--username=${this.server.username}`,
      `--password="${password}"`,
      `--out=${filePath}`,
    ].join(' ');

    try {
      await execAsync(command);
    } catch (error) {
      throw new Error(`MongoDB backup failed: ${error.message}`);
    }
  }

  async getBackupSize(filePath) {
    try {
      const stats = fs.statSync(filePath);
      return stats.size;
    } catch (error) {
      throw new Error(`Failed to get backup size: ${error.message}`);
    }
  }

  async getBackupChecksum(filePath) {
    return calculateFileChecksum(filePath);
  }
}
