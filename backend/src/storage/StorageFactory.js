import fs from 'fs';
import path from 'path';
import SftpClient from 'ssh2-sftp-client';
import aws from 'aws-sdk';
import { Client as MinioClient } from 'minio';

export class StorageFactory {
  static createStorage(provider) {
    switch (provider.type) {
      case 'LOCAL':
        return new LocalStorage(provider.config);
      case 'SFTP':
        return new SFTPStorage(provider.config);
      case 'S3':
        return new S3Storage(provider.config);
      case 'MINIO':
        return new MinioStorage(provider.config);
      default:
        throw new Error(`Unsupported storage type: ${provider.type}`);
    }
  }
}

class LocalStorage {
  constructor(config) {
    this.basePath = config.basePath || './backups';
  }

  async upload(localPath, remotePath) {
    const fullPath = path.join(this.basePath, remotePath);
    const dir = path.dirname(fullPath);

    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    fs.copyFileSync(localPath, fullPath);
    return fullPath;
  }

  async download(remotePath, localPath) {
    const fullPath = path.join(this.basePath, remotePath);
    fs.copyFileSync(fullPath, localPath);
    return localPath;
  }

  async delete(remotePath) {
    const fullPath = path.join(this.basePath, remotePath);
    if (fs.existsSync(fullPath)) {
      fs.unlinkSync(fullPath);
    }
  }

  async listFiles(remotePath = '') {
    const fullPath = path.join(this.basePath, remotePath);
    if (!fs.existsSync(fullPath)) {
      return [];
    }

    return fs.readdirSync(fullPath);
  }

  async getFileSize(remotePath) {
    const fullPath = path.join(this.basePath, remotePath);
    const stats = fs.statSync(fullPath);
    return stats.size;
  }
}

class SFTPStorage {
  constructor(config) {
    this.config = config;
    this.client = new SftpClient();
  }

  async connect() {
    await this.client.connect({
      host: this.config.host,
      port: this.config.port || 22,
      username: this.config.username,
      password: this.config.password,
      privateKey: this.config.privateKey,
    });
  }

  async disconnect() {
    await this.client.end();
  }

  async upload(localPath, remotePath) {
    await this.connect();
    try {
      await this.client.fastPut(localPath, remotePath);
      return remotePath;
    } finally {
      await this.disconnect();
    }
  }

  async download(remotePath, localPath) {
    await this.connect();
    try {
      await this.client.fastGet(remotePath, localPath);
      return localPath;
    } finally {
      await this.disconnect();
    }
  }

  async delete(remotePath) {
    await this.connect();
    try {
      await this.client.delete(remotePath);
    } finally {
      await this.disconnect();
    }
  }

  async getFileSize(remotePath) {
    await this.connect();
    try {
      const info = await this.client.stat(remotePath);
      return info.size;
    } finally {
      await this.disconnect();
    }
  }
}

class S3Storage {
  constructor(config) {
    this.s3 = new aws.S3({
      accessKeyId: config.accessKey,
      secretAccessKey: config.secretKey,
      region: config.region,
    });
    this.bucket = config.bucket;
  }

  async upload(localPath, remotePath) {
    const fileContent = fs.readFileSync(localPath);

    await this.s3
      .putObject({
        Bucket: this.bucket,
        Key: remotePath,
        Body: fileContent,
      })
      .promise();

    return `s3://${this.bucket}/${remotePath}`;
  }

  async download(remotePath, localPath) {
    const data = await this.s3
      .getObject({
        Bucket: this.bucket,
        Key: remotePath,
      })
      .promise();

    fs.writeFileSync(localPath, data.Body);
    return localPath;
  }

  async delete(remotePath) {
    await this.s3
      .deleteObject({
        Bucket: this.bucket,
        Key: remotePath,
      })
      .promise();
  }

  async getFileSize(remotePath) {
    const headObject = await this.s3
      .headObject({
        Bucket: this.bucket,
        Key: remotePath,
      })
      .promise();

    return headObject.ContentLength;
  }
}

class MinioStorage {
  constructor(config) {
    this.client = new MinioClient({
      endPoint: config.endPoint,
      port: config.port || 9000,
      useSSL: config.useSSL !== false,
      accessKey: config.accessKey,
      secretKey: config.secretKey,
    });
    this.bucket = config.bucket;
  }

  async upload(localPath, remotePath) {
    const stat = fs.statSync(localPath);
    const stream = fs.createReadStream(localPath);

    await this.client.putObject(this.bucket, remotePath, stream, stat.size);
    return remotePath;
  }

  async download(remotePath, localPath) {
    const dataStream = await this.client.getObject(this.bucket, remotePath);
    const writeStream = fs.createWriteStream(localPath);

    return new Promise((resolve, reject) => {
      dataStream.pipe(writeStream);
      writeStream.on('finish', () => resolve(localPath));
      writeStream.on('error', reject);
      dataStream.on('error', reject);
    });
  }

  async delete(remotePath) {
    await this.client.removeObject(this.bucket, remotePath);
  }

  async getFileSize(remotePath) {
    const stat = await this.client.statObject(this.bucket, remotePath);
    return stat.size;
  }
}

export {
  LocalStorage, SFTPStorage, S3Storage, MinioStorage,
};
