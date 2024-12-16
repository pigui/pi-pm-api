import { registerAs } from '@nestjs/config';

export const redisConfig = registerAs('config', () => {
  return {
    redisHost: process.env['REDIS_HOST'],
    redisPort: parseInt(process.env['REDIS_PORT'] ?? '6379', 10),
  };
});
