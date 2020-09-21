import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import ArticleController from 'src/controller/article';
import ArticleService from '../service/article';
import { Article, ArticleSchema } from '../models/article';

@Module({
  imports: [MongooseModule.forFeature([
    { name: Article.name, schema: ArticleSchema },
  ])],
  controllers: [ArticleController],
  providers: [ArticleService],
})
export default class ArticleModule {}
