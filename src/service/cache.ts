/*
 * @Author: your name
 * @Date: 2020-09-25 15:20:00
 * @LastEditTime: 2020-09-25 17:55:34
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

  async set(key: string, value: Redis.ValueType | Record<string, unknown>, expireTime?: number) {
    const tmp = JSON.stringify(value);
    if (!expireTime) {
      await this.redisClient.set(key, tmp);
    } else {
      await this.redisClient.set(key, tmp, 'EX', expireTime);
    }
  }

  async get(key: string) {
    const data = await this.redisClient.get(key);
    return JSON.parse(data);
  }

  async delete(key: string) {
    await this.redisClient.del(key);
  }

  async flushAll() {
    await this.redisClient.flushall();
  }
}
