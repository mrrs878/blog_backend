/*
 * @Author: mrrs878@foxmail.com
 * @Date: 2021-07-11 21:34:10
 * @LastEditors: mrrs878@foxmail.com
 * @LastEditTime: 2021-07-12 16:14:21
 * @FilePath: \blog_backend\src\auth\auth.module.ts
 */
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CacheService } from 'src/cache/cache.service';
import { Menu } from 'src/menu/menu.entity';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { User } from './user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Menu])],
  controllers: [AuthController],
  providers: [AuthService, CacheService],
})
export class AuthModule {}
