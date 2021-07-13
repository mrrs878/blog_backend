/*
 * @Author: mrrs878
 * @Date: 2020-09-25 15:40:28
 * @LastEditTime: 2020-09-25 15:46:31
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \blog_backend\src\modules\cache.ts
 */
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { RedisModule } from 'nestjs-redis/dist';

@Module({
  imports: [
    RedisModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        url: configService.get('REDIS_URL'),
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
export class RedisCacheModule {
}
