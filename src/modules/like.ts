/*
 * @Author: mrrs878@foxmail.com
 * @Date: 2020-10-15 11:08:22
 * @LastEditTime: 2020-10-15 13:21:24
 * @LastEditors: mrrs878@foxmail.com
 * @Description: In User Settings Edit
 * @FilePath: \blog_backend\src\modules\like.ts
 */
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import LikeController from 'src/controller/like';
import { Like, LikeSchema } from 'src/models/like';
import LikeService from 'src/service/like';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Like.name, schema: LikeSchema },
    ]),
  ],
  controllers: [LikeController],
  providers: [LikeService],
})
export default class LikeModule {}
