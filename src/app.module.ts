/*
 * @Author: mrrs878
 * @Date: 2020-09-21 14:48:46
 * @LastEditTime: 2020-11-20 15:01:08
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \blog_backend\src\app.module.ts
 */
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import * as dayjs from 'dayjs';
import 'dayjs/locale/zh-cn';
import DB from './modules/db';
import { RedisCacheModule } from './modules/cache';
import ArticleModule from './modules/article';
import AuthModule from './modules/auth';
import DictModule from './modules/dict';
import CommentModule from './modules/comment';
import UserModule from './modules/user';
import LikeModule from './modules/like';
import PageModule from './modules/page';

dayjs.locale('zh-cn');

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
    UserModule,
    LikeModule,
    PageModule,
  ],
})
export default class AppModule {}
