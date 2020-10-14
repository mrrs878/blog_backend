/*
 * @Author: mrrs878
 * @Date: 2020-09-21 19:08:46
 * @LastEditTime: 2020-10-14 13:11:28
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \blog_backend\src\models\article.ts
 */
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ collection: 'dict' })
export class Dict extends Document {
  @Prop()
  status: number;

  @Prop()
  label: string;

  @Prop()
  label_view: string;

  @Prop()
  type: string;

  @Prop()
  type_view: string;

  @Prop()
  name: string;

  @Prop()
  name_view: string;

  @Prop()
  value: number;

  @Prop({ required: false, default: new Date().toLocaleString() })
  createTime?: string;

  @Prop({ required: false, default: new Date().toLocaleString() })
  updateTime?: string;
}

export const DictSchema = SchemaFactory.createForClass(Dict);
