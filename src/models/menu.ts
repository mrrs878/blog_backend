/*
 * @Author: mrrs878
 * @Date: 2020-09-21 14:48:46
 * @LastEditTime: 2020-10-16 09:52:00
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \blog_backend\src\models\user.ts
 */
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { BaseModel } from './base';

@Schema({ collection: 'menu' })
export class Menu extends BaseModel {
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

  @Prop({ required: false })
  position: number;
}

export const MenuSchema = SchemaFactory.createForClass(Menu);
