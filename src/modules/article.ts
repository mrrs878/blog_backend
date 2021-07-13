/*
 * @Author: mrrs878
 * @Date: 2020-09-21 14:48:46
 * @LastEditTime: 2020-09-25 15:18:27
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \blog_backend\src\modules\article.ts
 */
import { CacheModule, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import ArticleController from 'src/controller/article';
import ArticleService from '../service/article';
import { Article, ArticleSchema } from '../models/article';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Article.name, schema: ArticleSchema },
    ]),
    CacheModule.register(),
  ],
  controllers: [ArticleController],
  providers: [ArticleService],
})
export default class ArticleModule {}
