/*
 * @Author: mrrs878@foxmail.com
 * @Date: 2021-03-19 12:27:47
 * @LastEditTime: 2021-03-19 12:32:13
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /blog_backend/src/modules/realTimeBus.ts
 */
import { Module } from '@nestjs/common';
import RealTimeBusController from 'src/controller/realTimeBus';
import CacheService from 'src/service/cache';
import RealTimeBusService from 'src/service/realTimeBus';

@Module({
  imports: [
  ],
  controllers: [RealTimeBusController],
  providers: [RealTimeBusService, CacheService],
})
export default class RealTimeBusModule {}
