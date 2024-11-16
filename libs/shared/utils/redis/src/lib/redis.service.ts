import { Inject, Injectable } from '@nestjs/common';
import Redis from 'ioredis';
import { REDIS_INSTANCE } from './constants/redis.constants';

@Injectable()
export class RedisService {
  constructor(@Inject(REDIS_INSTANCE) private readonly redis: Redis) {}

  set(key: string | Buffer, value: string | Buffer | number): void {
    this.redis.set(key, value);
  }

  get(key: string | Buffer): Promise<string | null> {
    return this.redis.get(key);
  }
}
