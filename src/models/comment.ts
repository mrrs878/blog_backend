import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ collection: 'comment' })
export class Comment extends Document {
  @Prop()
  name: string;

  @Prop()
  content: string;

  @Prop()
  user_id: string;

  @Prop()
  article_id: string;

  @Prop()
  status: number;

  @Prop({ required: false, default: new Date().toLocaleString() })
  createTime?: string;

  @Prop({ required: false, default: new Date().toLocaleString() })
  updateTime?: string;
}

export const CommentSchema = SchemaFactory.createForClass(Comment);
