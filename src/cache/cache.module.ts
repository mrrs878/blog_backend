/*
 * @Author: mrrs878@foxmail.com
 * @Date: 2021-07-11 22:23:25
 * @LastEditors: mrrs878@foxmail.com
 * @LastEditTime: 2021-07-12 17:45:42
 * @FilePath: \blog_backend\src\cache\cache.module.ts
 */
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { RedisModule } from '../common/lib/nestjs-redis';

@Module({
  imports: [
    RedisModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async () => ({
        url: process.env.REDIS_HOST,
        port: parseInt(process.env.REDIS_PORT, 10),
        name: process.env.REDIS_NAME,
        onClientReady: async (client) => {
          console.log('connected to redis');
          client.on('error', (err) => {
            console.log(err);
          });
        },
      }),
      inject: [ConfigService],
    }),
  ],
})
export class CacheModule {}
