/*
 * @Author: mrrs878
 * @Date: 2020-09-21 14:48:46
 * @LastEditTime: 2020-10-09 18:46:32
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \blog_backend\src\app.module.ts
 */
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import DB from './modules/db';
import { RedisCacheModule } from './modules/cache';
import ArticleModule from './modules/article';
import AuthModule from './modules/auth';
import DictModule from './modules/dict';
import CommentModule from './modules/comment';

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
    DictModule,
    CommentModule,
  ],
})
export default class AppModule {}
