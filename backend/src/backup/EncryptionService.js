import crypto from 'crypto';
import fs from 'fs';
import { encrypt, decrypt } from '../utils/encryption.js';

export class EncryptionService {
  static async encryptFile(inputPath, outputPath) {
    return new Promise((resolve, reject) => {
      const algorithm = 'aes-256-cbc';
      const key = crypto
        .createHash('sha256')
        .update(process.env.ENCRYPTION_KEY || 'your-key')
        .digest();
      const iv = crypto.randomBytes(16);

      const input = fs.createReadStream(inputPath);
      const output = fs.createWriteStream(outputPath);
      const cipher = crypto.createCipheriv(algorithm, key, iv);

      output.write(iv);

      input.pipe(cipher).pipe(output);

      output.on('finish', resolve);
      output.on('error', reject);
      input.on('error', reject);
    });
  }

  static async decryptFile(inputPath, outputPath) {
    return new Promise((resolve, reject) => {
      const algorithm = 'aes-256-cbc';
      const key = crypto
        .createHash('sha256')
        .update(process.env.ENCRYPTION_KEY || 'your-key')
        .digest();

      const input = fs.createReadStream(inputPath);
      const output = fs.createWriteStream(outputPath);

      input.on('readable', () => {
        const iv = input.read(16);
        if (!iv) return;

        const decipher = crypto.createDecipheriv(algorithm, key, iv);
        input.pipe(decipher).pipe(output);
      });

      output.on('finish', resolve);
      output.on('error', reject);
      input.on('error', reject);
    });
  }
}
