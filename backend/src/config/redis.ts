import Redis from 'ioredis';
import dotenv from 'dotenv';

dotenv.config();

const redisUrl = process.env.REDIS_URL || 'redis://localhost:6379';

const redisConnection = new Redis(redisUrl, {
  maxRetriesPerRequest: null, // Critical setup for BullMQ
  // Enable TLS if using secure connection (e.g. rediss:// with Upstash)
  ...(redisUrl.startsWith('rediss://') ? { tls: { rejectUnauthorized: false } } : {})
});

redisConnection.on('connect', () => {
  console.log('Redis Connected');
});

redisConnection.on('error', (err) => {
  console.error('Redis Connection Error:', err);
});

export default redisConnection;
