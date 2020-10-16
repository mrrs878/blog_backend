/*
 * @Author: mrrs878
 * @Date: 2020-09-21 19:08:46
 * @LastEditTime: 2020-10-16 12:49:39
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \blog_backend\src\models\article.ts
 */
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { BaseModel } from './base';

@Schema({ collection: 'dict' })
export class Dict extends BaseModel {
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

  @Prop()
  creator: string;

  @Prop()
  updater: string;
}

export const DictSchema = SchemaFactory.createForClass(Dict);
