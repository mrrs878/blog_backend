import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import ArticleController from 'src/controller/article';
import { ArticleContent, ArticleContentSchema } from 'src/models/content';
import ArticleService from '../service/article';
import { ArticleSummary, ArticleSummarySchema } from '../models/summary';

@Module({
  imports: [MongooseModule.forFeature([
    { name: ArticleSummary.name, schema: ArticleSummarySchema },
    { name: ArticleContent.name, schema: ArticleContentSchema },
  ])],
  controllers: [ArticleController],
  providers: [ArticleService],
})
export default class ArticleModule {}
