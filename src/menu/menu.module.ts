/*
 * @Author: mrrs878@foxmail.com
 * @Date: 2021-07-11 23:45:49
 * @LastEditors: mrrs878@foxmail.com
 * @LastEditTime: 2021-07-12 16:15:19
 * @FilePath: \blog_backend\src\menu\menu.module.ts
 */
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MenuController } from './menu.controller';
import { Menu } from './menu.entity';
import { MenuService } from './menu.service';

@Module({
  imports: [TypeOrmModule.forFeature([Menu])],
  controllers: [MenuController],
  providers: [MenuService],
})
export class MenuModule {}
