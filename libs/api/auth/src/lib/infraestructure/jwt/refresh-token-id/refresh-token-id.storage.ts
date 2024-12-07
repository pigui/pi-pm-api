import { RedisService } from '@api/shared/utils/redis';
import { Injectable } from '@nestjs/common';

export class InvalidatedRefreshTokenError extends Error {}

@Injectable()
export class RefreshTokenIdStorage {
  constructor(private readonly redisService: RedisService) {}
  async insert(userId: string, tokenId: string): Promise<void> {
    await this.redisService.set(this.getKey(userId), tokenId);
  }

  async validate(userId: string, tokenId: string): Promise<boolean> {
    const storedId = await this.redisService.get(this.getKey(userId));
    if (storedId !== tokenId) {
      throw new InvalidatedRefreshTokenError();
    }
    return storedId === tokenId;
  }

  async invalidate(userId: string): Promise<void> {
    await this.redisService.del(this.getKey(userId));
  }
  private getKey(userId: string): string {
    return `user-${userId}`;
  }
}
