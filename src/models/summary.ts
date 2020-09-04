import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ collection: 'summary' })
export class ArticleSummary extends Document {
  @Prop()
  category: string;

  @Prop()
  createTime: string;

  @Prop()
  description: string;

  @Prop()
  tag: string;

  @Prop()
  title: string;

  @Prop()
  updateTime: string;

  @Prop({ default: false })
  isDeleted: boolean;

  @Prop()
  deleteTime: number;
}

export const ArticleSummarySchema = SchemaFactory.createForClass(ArticleSummary);
