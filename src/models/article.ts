/*
 * @Author: mrrs878
 * @Date: 2020-09-21 19:08:46
 * @LastEditTime: 2020-10-09 16:20:43
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \blog_backend\src\models\article.ts
 */
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

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

  @Prop({ type: [Types.ObjectId], ref: 'comment' })
  comments: Array<any>;

  @Prop()
  updateTime: string;

  @Prop({ default: false })
  isDeleted: boolean;

  @Prop()
  deleteTime: string;

  @Prop()
  content: string;

  @Prop()
  author: string;
}

export const ArticleSchema = SchemaFactory.createForClass(Article);
