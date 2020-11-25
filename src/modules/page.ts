/*
* @Author: your name
* @Date: 2020-11-20 14:46:48
 * @LastEditTime: 2020-11-20 15:15:05
 * @LastEditors: Please set LastEditors
* @Description: In User Settings Edit
* @FilePath: \blog_backend\src\modules\page.ts
*/
import { CacheModule, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import PageController from 'src/controller/page';
import { Article, ArticleSchema } from 'src/models/article';
import ArticleService from 'src/service/article';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Article.name, schema: ArticleSchema },
    ]),
    CacheModule.register(),
  ],
  controllers: [PageController],
  providers: [ArticleService],
})
export default class PageModule {}
