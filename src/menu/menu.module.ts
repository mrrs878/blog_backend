/*
 * @Author: mrrs878@foxmail.com
 * @Date: 2021-07-11 23:45:49
 * @LastEditors: mrrs878@foxmail.com
 * @LastEditTime: 2021-07-11 23:48:03
 * @FilePath: \blog_backend_bkp\src\menu\menu.module.ts
 */
import { Module } from '@nestjs/common';
import { MenuController } from './menu.controller';
import { MenuService } from './menu.service';

@Module({
  controllers: [MenuController],
  providers: [MenuService],
})
export class MenuModule {}
