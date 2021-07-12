/*
 * @Author: mrrs878@foxmail.com
 * @Date: 2021-07-09 16:43:04
 * @LastEditors: mrrs878@foxmail.com
 * @LastEditTime: 2021-07-12 16:14:36
 * @FilePath: \blog_backend\src\app.module.ts
 */
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { BlogModule } from './blog/blog.module';
import { DBModule } from './db/db.module';
import { ViewModule } from './view/view.module';
import { AuthModule } from './auth/auth.module';
import { MenuModule } from './menu/menu.module';
import { CacheModule } from './cache/cache.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: ['.env.local', '.env'],
      isGlobal: true,
    }),
    CacheModule,
    DBModule,
    MenuModule,
    BlogModule,
    ViewModule,
    AuthModule,
  ],
})
export class AppModule {}
