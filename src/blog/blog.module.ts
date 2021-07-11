/*
 * @Author: mrrs878@foxmail.com
 * @Date: 2021-07-09 17:22:25
 * @LastEditors: mrrs878@foxmail.com
 * @LastEditTime: 2021-07-09 18:25:04
 * @FilePath: \blog_backend\src\blog\blog.module.ts
 */
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Article } from './article.entity';
import { BlogController } from './blog.controller';
import { BlogService } from './blog.service';

@Module({
  imports: [TypeOrmModule.forFeature([Article])],
  controllers: [BlogController],
  providers: [BlogService],
})
export class BlogModule {}
