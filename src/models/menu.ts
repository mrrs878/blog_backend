/*
 * @Author: mrrs878
 * @Date: 2020-09-21 14:48:46
 * @LastEditTime: 2020-10-14 19:10:11
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \blog_backend\src\models\user.ts
 */
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ collection: 'menu' })
export class Menu extends Document {
  @Prop({ unique: true })
  key: string;

  @Prop({ required: false })
  icon_name?: string;

  @Prop()
  title: string;

  @Prop({ default: '', required: false })
  path?: string;

  @Prop({ required: false, default: [] })
  sub_menu?: Array<string>;

  @Prop()
  parent: string;

  @Prop({ required: false })
  role?: Array<number>;

  @Prop({ default: 1 })
  status?: number;

  @Prop({ required: false, default: new Date().toLocaleString() })
  createTime?: string;

  @Prop({ required: false, default: new Date().toLocaleString() })
  updateTime?: string;
}

export const MenuSchema = SchemaFactory.createForClass(Menu);
