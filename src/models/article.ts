/*
 * @Author: your name
 * @Date: 2020-09-21 19:08:46
 * @LastEditTime: 2020-09-22 13:12:51
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \blog_backend\src\models\article.ts
 */
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ collection: 'article' })
export class Article extends Document {
  @Prop()
  categories: string;

  @Prop()
  createTime: string;

  @Prop()
  description: string;

  @Prop()
  tag: string;

  @Prop()
  title: string;

  @Prop()
  updateTime: string;

  @Prop({ default: false })
  isDeleted: boolean;

  @Prop()
  deleteTime: number;

  @Prop()
  content: string;
}

export const ArticleSchema = SchemaFactory.createForClass(Article);
