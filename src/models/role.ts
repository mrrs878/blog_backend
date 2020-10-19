/*
 * @Author: your name
 * @Date: 2020-10-19 13:13:09
 * @LastEditTime: 2020-10-19 13:13:45
 * @LastEditors: your name
 * @Description: In User Settings Edit
 * @FilePath: \blog_backend\src\models\role.ts
 */
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { BaseModel } from './base';

@Schema({ collection: 'role' })
export class Role extends BaseModel {
  @Prop()
  dict_id: string;

  @Prop()
  menu: Array<string>;
}

export const LikeSchema = SchemaFactory.createForClass(Role);