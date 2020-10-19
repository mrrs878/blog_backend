/*
 * @Author: your name
 * @Date: 2020-10-09 09:57:52
 * @LastEditTime: 2020-10-19 12:01:03
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \blog_backend\src\models\comment.ts
 */
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ collection: 'comment' })
export class Comment extends Document {
  @Prop()
  content: string;

  @Prop()
  creator_id: string;

  @Prop({ type: Types.ObjectId })
  article_id: string;

  @Prop()
  status: number;

  @Prop({ required: false, default: new Date().toLocaleString() })
  createTime?: string;

  @Prop({ required: false, default: new Date().toLocaleString() })
  updateTime?: string;
}

export const CommentSchema = SchemaFactory.createForClass(Comment);
