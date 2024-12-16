import { Inject, Injectable } from '@nestjs/common';
import Redis from 'ioredis';
import { REDIS_INSTANCE } from './constants/redis.constants';

@Injectable()
export class RedisService {
  constructor(@Inject(REDIS_INSTANCE) private readonly redis: Redis) {}

  async set(
    key: string | Buffer,
    value: string | Buffer | number
  ): Promise<void> {
    this.redis.set(key, value);
  }

  async get(key: string | Buffer): Promise<string | null> {
    return this.redis.get(key);
  }

  async del(key: string): Promise<void> {
    this.redis.del(key);
  }
}
