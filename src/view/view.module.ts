/*
 * @Author: mrrs878@foxmail.com
 * @Date: 2021-07-11 16:13:34
 * @LastEditors: mrrs878@foxmail.com
 * @LastEditTime: 2021-07-11 16:25:13
 * @FilePath: \blog_backend\src\view\view.module.ts
 */
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Article } from 'src/blog/article.entity';
import { BlogService } from 'src/blog/blog.service';
import { ViewController } from './view.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Article])],
  providers: [BlogService],
  controllers: [ViewController],
})
export class ViewModule {}
