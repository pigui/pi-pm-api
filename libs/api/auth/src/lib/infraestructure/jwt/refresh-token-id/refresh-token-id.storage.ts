import { RedisService } from '@api/shared/util/redis';
import { Injectable, Logger } from '@nestjs/common';

export class InvalidatedRefreshTokenError extends Error {}

@Injectable()
export class RefreshTokenIdStorage {
  private readonly logger = new Logger(RefreshTokenIdStorage.name);
  constructor(private readonly redisService: RedisService) {}
  async insert(userId: string, tokenId: string): Promise<void> {
    this.logger.log(this.insert.name);
    await this.redisService.set(this.getKey(userId), tokenId);
  }

  async validate(userId: string, tokenId: string): Promise<boolean> {
    this.logger.log(this.validate.name);
    const storedId = await this.redisService.get(this.getKey(userId));
    if (storedId !== tokenId) {
      throw new InvalidatedRefreshTokenError();
    }
    return storedId === tokenId;
  }

  async invalidate(userId: string): Promise<void> {
    this.logger.log(this.invalidate.name);
    await this.redisService.del(this.getKey(userId));
  }
  private getKey(userId: string): string {
    return `user-${userId}`;
  }
}
