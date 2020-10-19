/*
 * @Author: your name
 * @Date: 2020-10-15 11:04:23
 * @LastEditTime: 2020-10-19 13:14:02
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \blog_backend\src\models\like.ts
 */
/*
 * @Author: your name
 * @Date: 2020-10-15 11:04:23
 * @LastEditTime: 2020-10-15 11:07:27
 * @LastEditors: your name
 * @Description: In User Settings Edit
 * @FilePath: \blog_backend\src\models\like.ts
 */
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { BaseModel } from './base';

@Schema({ collection: 'like' })
export class Like extends BaseModel {
  @Prop()
  article_id: string;

  @Prop()
  name: string;
}

export const LikeSchema = SchemaFactory.createForClass(Like);
