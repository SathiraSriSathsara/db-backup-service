import crypto from 'crypto';

export const generateRandomToken = (length = 32) => {
  return crypto.randomBytes(length).toString('hex');
};

export const hashToken = (token) => {
  return crypto.createHash('sha256').update(token).digest('hex');
};

export const calculateFileChecksum = (filePath) => {
  const fs = require('fs');
  const hash = crypto.createHash('sha256');
  const stream = fs.createReadStream(filePath);

  return new Promise((resolve, reject) => {
    stream.on('data', (data) => {
      hash.update(data);
    });
    stream.on('end', () => {
      resolve(hash.digest('hex'));
    });
    stream.on('error', reject);
  });
};

export const generateCronExpression = (frequency, time) => {
  const [hours, minutes] = time.split(':');

  const crons = {
    EVERY_MINUTE: '* * * * *',
    HOURLY: `0 * * * *`,
    DAILY: `${minutes} ${hours} * * *`,
    WEEKLY: `${minutes} ${hours} * * 1`, // Monday
    MONTHLY: `${minutes} ${hours} 1 * *`, // 1st of month
  };

  return crons[frequency] || null;
};
