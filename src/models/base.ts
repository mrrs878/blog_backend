/*
 * @Author: mrrs878@foxmail.com
 * @Date: 2020-10-15 11:05:22
 * @LastEditTime: 2020-10-15 16:21:17
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \blog_backend\src\models\base.ts
 */
import { Prop, Schema } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class BaseModel extends Document {
  @Prop()
  name: string;

  @Prop()
  status: number;

  @Prop({ required: false, default: new Date().toLocaleString() })
  createTime?: string;

  @Prop({ required: false, default: new Date().toLocaleString() })
  updateTime?: string;
}
