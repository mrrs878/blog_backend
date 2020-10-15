/*
 * @Author: mrrs878
 * @Date: 2020-09-21 14:48:46
 * @LastEditTime: 2020-10-15 10:21:13
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \blog_backend\src\models\user.ts
 */
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import MAIN_CONFIG from 'src/config';

@Schema({ collection: 'user' })
export class User extends Document {
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

  @Prop()
  status: number;

  @Prop({ required: false, default: new Date().toLocaleString() })
  createTime?: string;

  @Prop({ required: false, default: new Date().toLocaleString() })
  updateTime?: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
