import fs from 'fs';
import path from 'path';
import zlib from 'zlib';
import { pipeline } from 'stream/promises';

export class CompressionService {
  static async compressFile(inputPath, outputPath) {
    return new Promise((resolve, reject) => {
      const source = fs.createReadStream(inputPath);
      const gzip = zlib.createGzip();
      const dest = fs.createWriteStream(outputPath);

      pipeline(source, gzip, dest, (err) => {
        if (err) reject(err);
        else resolve();
      });
    });
  }

  static async decompressFile(inputPath, outputPath) {
    return new Promise((resolve, reject) => {
      const source = fs.createReadStream(inputPath);
      const gunzip = zlib.createGunzip();
      const dest = fs.createWriteStream(outputPath);

      pipeline(source, gunzip, dest, (err) => {
        if (err) reject(err);
        else resolve();
      });
    });
  }

  static getCompressedSize(uncompressedSize) {
    // Rough estimate: compression typically reduces to 10-30% of original
    return Math.ceil(uncompressedSize * 0.2);
  }
}
