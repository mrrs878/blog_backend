/*
 * @Author: mrrs878
 * @Date: 2020-09-21 19:08:46
 * @LastEditTime: 2020-10-19 23:07:41
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \blog_backend\src\models\article.ts
 */
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { BaseModel } from './base';

@Schema({ collection: 'article' })
export class Article extends BaseModel {
  @Prop()
  categories: string;

  @Prop()
  createTime: string;

  @Prop()
  description: string;

  @Prop()
  tags: string;

  @Prop()
  title: string;

  @Prop()
  content: string;

  @Prop()
  author: string;

  @Prop()
  author_id: string;
}

export const ArticleSchema = SchemaFactory.createForClass(Article);
