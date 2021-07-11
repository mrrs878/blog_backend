/*
 * @Author: mrrs878@foxmail.com
 * @Date: 2021-07-09 16:43:04
 * @LastEditors: mrrs878@foxmail.com
 * @LastEditTime: 2021-07-11 23:47:10
 * @FilePath: \blog_backend_bkp\src\app.module.ts
 */
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { BlogModule } from './blog/blog.module';
import { DBModule } from './db/db.module';
import { CommonModule } from './common/common.module';
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
    DBModule,
    CacheModule,
    CommonModule,
    BlogModule,
    ViewModule,
    AuthModule,
    MenuModule,
  ],
})
export class AppModule {}
