/*
 * @Author: mrrs878
 * @Date: 2020-09-25 15:20:00
 * @LastEditTime: 2021-03-22 19:21:19
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \blog_backend\src\service\cache.ts
 */
import { Injectable } from '@nestjs/common';
import { RedisService } from 'nestjs-redis/dist';
import * as Redis from 'ioredis';

@Injectable()
export default class CacheService {
  private redisClient: Redis.Redis;

  constructor(private readonly redisService: RedisService) {
    this.getClient();
  }

  private getClient() {
    this.redisClient = this.redisService.getClient();
  }

  async set<T = Redis.ValueType | Record<string, unknown>>(key: string, value: T, expireTime?: number) {
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
