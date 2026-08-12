import { Queue } from 'bullmq';
import { redisConnection } from '../config/redis.config';

export const fileQueue = new Queue('file-processing', { connection: redisConnection });

export const addProcessJob = async (payload: { filePath: string; fileName: string }) => {
  await fileQueue.add('process-csv', payload, {
    attempts: 3,
    backoff: { type: 'exponential', delay: 2000 }
  });
};