import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ collection: 'content' })
export class ArticleContent extends Document {
  @Prop()
  content: string;

  @Prop()
  title: string;

  @Prop()
  updateTime: string;

  @Prop({ default: false })
  isDeleted: boolean;

  @Prop()
  deleteTime: number;
}

export const ArticleContentSchema = SchemaFactory.createForClass(ArticleContent);
