import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type AnswerDocument = Answer & Document;

@Schema({ timestamps: true })
export class Answer {
  @Prop({ required: true })
  sessionId: string;

  @Prop({ required: true })
  lessonId: string;

  @Prop({ required: true })
  questionId: string;

  @Prop({ required: true })
  answer: string;

  @Prop({ default: false })
  isCorrect: boolean;

  @Prop({ default: 0 })
  points: number;

  @Prop()
  teacherFeedback?: string;

  @Prop({ default: false })
  reviewedByTeacher: boolean;

  @Prop()
  submittedAt?: Date;
}

export const AnswerSchema = SchemaFactory.createForClass(Answer);

AnswerSchema.index({ sessionId: 1 });
AnswerSchema.index({ questionId: 1 });