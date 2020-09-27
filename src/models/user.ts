/*
 * @Author: mrrs878
 * @Date: 2020-09-21 14:48:46
 * @LastEditTime: 2020-09-24 17:07:22
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

  @Prop({ default: MAIN_CONFIG.ROLE.HUMAN, required: false })
  role: number;
}

export const UserSchema = SchemaFactory.createForClass(User);
