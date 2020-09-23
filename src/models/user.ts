/*
 * @Author: your name
 * @Date: 2020-09-21 14:48:46
 * @LastEditTime: 2020-09-23 18:24:17
 * @LastEditors: mrrs878
 * @Description: In User Settings Edit
 * @FilePath: \blog_backend\src\models\user.ts
 */
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ collection: 'user' })
export class User extends Document {
  @Prop()
  name: string;

  @Prop()
  passwordHash: string;

  @Prop()
  salt: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
