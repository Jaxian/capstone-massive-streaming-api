import Redis, { RedisOptions } from 'ioredis';

const redisOptions: RedisOptions = {
  host: process.env.REDIS_HOST || '127.0.0.1',
  port: Number(process.env.REDIS_PORT) || 6379,
  maxRetriesPerRequest: null, // Strictly required by BullMQ
};

// Exporting a Redis instance solves the ConnectionOptions type mismatch
export const redisConnection = new Redis(redisOptions);