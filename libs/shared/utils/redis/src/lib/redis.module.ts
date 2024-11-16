import { Module } from '@nestjs/common';
import Redis from 'ioredis';
import { RedisService } from './redis.service';
import { REDIS_INSTANCE } from './constants/redis.constants';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { redisConfig } from './constants/config/redis.config';

@Module({
  controllers: [],
  imports: [ConfigModule.forFeature(redisConfig)],
  providers: [
    RedisService,
    {
      provide: REDIS_INSTANCE,
      useFactory: (configService: ConfigService) => {
        const host = configService.get('REDIS_HOST');
        const port = +configService.get('REDIS_PORT');
        return new Redis({ host, port });
      },
      inject: [ConfigService],
    },
  ],
  exports: [RedisService],
})
export class RedisModule {}
