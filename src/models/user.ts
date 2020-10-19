/*
 * @Author: mrrs878
 * @Date: 2020-09-21 14:48:46
 * @LastEditTime: 2020-10-19 11:58:39
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \blog_backend\src\models\user.ts
 */
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import MAIN_CONFIG from 'src/config';
import { BaseModel } from './base';

@Schema({ collection: 'user' })
export class User extends BaseModel {
  @Prop()
  name: string;

  @Prop()
  passwordHash: string;

  @Prop()
  salt: string;

  @Prop()
  avatar: string;

  @Prop()
  createdBy: number;

  @Prop()
  signature: string;

  @Prop()
  department: string;

  @Prop()
  address: string;

  @Prop()
  profession: string;

  @Prop()
  tags: Array<string>;

  @Prop()
  teams: Array<string>;

  @Prop({ default: MAIN_CONFIG.ROLE.HUMAN, required: false })
  role: number;
}

export const UserSchema = SchemaFactory.createForClass(User);
