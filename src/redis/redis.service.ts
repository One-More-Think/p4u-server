import { Inject, Injectable } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';

@Injectable()
export class RedisService {
  constructor(
    @Inject(CACHE_MANAGER)
    private cacheManager: Cache,
  ) {}

  public async get(access_token: string): Promise<string> {
    return await this.cacheManager.get(access_token);
  }

  public async set(access_token: string, refresh_token: string): Promise<void> {
    return await this.cacheManager.set(access_token, refresh_token);
  }

  public async del(access_token: string): Promise<void> {
    await this.cacheManager.del(access_token);
  }
}
