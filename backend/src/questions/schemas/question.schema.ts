import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type QuestionDocument = Question & Document;

@Schema({ timestamps: true })
export class Question {
  @Prop({ required: true })
  lessonId: string;

  @Prop({ required: true, enum: ['multiple_choice', 'written'] })
  type: string;

  @Prop({ required: true })
  text: string;

  @Prop({ required: true })
  order: number;

  @Prop({ type: [String] })
  options?: string[];

  @Prop()
  correctAnswer?: string;

  @Prop()
  expectedAnswer?: string;

  @Prop()
  correction?: string;

  @Prop()
  explanation?: string;

  @Prop({ default: 1 })
  points: number;
}

export const QuestionSchema = SchemaFactory.createForClass(Question);

QuestionSchema.index({ lessonId: 1, order: 1 });