/*
 * @Author: mrrs878@foxmail.com
 * @Date: 2021-07-11 22:23:52
 * @LastEditors: mrrs878@foxmail.com
 * @LastEditTime: 2021-07-11 23:39:32
 * @FilePath: \blog_backend\src\cache\cache.service.ts
 */
import { Injectable } from '@nestjs/common';
import { RedisService } from 'nestjs-redis';
import * as Redis from 'ioredis';

@Injectable()
export class CacheService {
  private redisClient: Redis.Redis;

  constructor(private readonly redisService: RedisService) {
    this.getClient();
  }

  private getClient() {
    this.redisClient = this.redisService.getClient();
  }

  async set<T = Redis.ValueType | Record<string, unknown>>(
    key: string,
    value: T,
    expireTime?: number,
  ) {
    const tmp = JSON.stringify(value);
    if (!expireTime) {
      await this.redisClient.set(key, tmp);
    } else {
      await this.redisClient.set(key, tmp, 'EX', expireTime);
    }
  }

  async get(key: string) {
    const data = await this.redisClient.get(key);
    return data ? JSON.parse(data) : undefined;
  }

  async delete(key: string) {
    await this.redisClient.del(key);
  }

  async flushAll() {
    await this.redisClient.flushall();
  }
}
