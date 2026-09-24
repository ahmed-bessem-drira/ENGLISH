import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type LessonDocument = Lesson & Document;

export interface LessonSettings {
  showCorrectionImmediately: boolean;
  showFinalScore: boolean;
  showCorrectAnswersAtEnd: boolean;
  allowRetry: boolean;
  allowPreviousQuestion: boolean;
  shuffleQuestions: boolean;
  shuffleOptions: boolean;
}

@Schema({ timestamps: true })
export class Lesson {
  @Prop({ required: true })
  teacherId: string;

  @Prop({ required: true })
  title: string;

  @Prop()
  description: string;

  @Prop()
  category: string;

  @Prop({ enum: ['Beginner', 'Elementary', 'Intermediate', 'Upper Intermediate', 'Advanced'] })
  difficulty: string;

  @Prop({ enum: ['Draft', 'Active', 'Archived'], default: 'Draft' })
  status: string;

  @Prop({ required: true, unique: true })
  accessCode: string;

  @Prop({
    type: {
      showCorrectionImmediately: { type: Boolean, default: false },
      showFinalScore: { type: Boolean, default: true },
      showCorrectAnswersAtEnd: { type: Boolean, default: true },
      allowRetry: { type: Boolean, default: false },
      allowPreviousQuestion: { type: Boolean, default: false },
      shuffleQuestions: { type: Boolean, default: false },
      shuffleOptions: { type: Boolean, default: false },
    },
    default: {
      showCorrectionImmediately: false,
      showFinalScore: true,
      showCorrectAnswersAtEnd: true,
      allowRetry: false,
      allowPreviousQuestion: false,
      shuffleQuestions: false,
      shuffleOptions: false,
    },
  })
  settings: LessonSettings;
}

export const LessonSchema = SchemaFactory.createForClass(Lesson);

LessonSchema.index({ teacherId: 1 });
LessonSchema.index({ accessCode: 1 }, { unique: true });