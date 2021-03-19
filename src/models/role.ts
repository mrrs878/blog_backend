/*
 * @Author: mrrs878@foxmail.com
 * @Date: 2020-10-19 13:13:09
 * @LastEditTime: 2021-02-20 17:27:46
 * @LastEditors: Please set LastEditors
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
