import { CacheModule, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import CommentController from 'src/controller/comment';
import { Article, ArticleSchema } from 'src/models/article';
import CommentService from '../service/comment';
import { Comment, CommentSchema } from '../models/comment';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Comment.name, schema: CommentSchema },
      { name: Article.name, schema: ArticleSchema },
    ]),
    CacheModule.register(),
  ],
  controllers: [CommentController],
  providers: [CommentService],
})
export default class CommentModule {}
