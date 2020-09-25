/*
 * @Author: your name
 * @Date: 2020-09-21 14:48:46
 * @LastEditTime: 2020-09-25 18:48:05
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \blog_backend\src\app.module.ts
 */
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import ArticleModule from './modules/article';
import DB from './modules/db';
import { RedisCacheModule } from './modules/cache';
import AuthModule from './modules/auth';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: ['.env.local', '.env'],
      isGlobal: true,
    }),
    RedisCacheModule,
    DB,
    AuthModule,
    ArticleModule,
  ],
})
export default class AppModule {}
