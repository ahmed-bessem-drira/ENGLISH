import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type StudentSessionDocument = StudentSession & Document;

@Schema({ timestamps: true })
export class StudentSession {
  @Prop({ required: true })
  lessonId: string;

  @Prop({ required: true })
  studentName: string;

  // Classe d'origine (via le code de classe utilise au join). Absent si join via le code general de la lecon.
  @Prop()
  classroomId?: string;

  @Prop()
  className?: string;

  @Prop({ required: true, unique: true })
  sessionToken: string;

  @Prop({ default: 0 })
  currentQuestionIndex: number;

  @Prop({ enum: ['NOT_STARTED', 'IN_PROGRESS', 'COMPLETED'], default: 'NOT_STARTED' })
  status: string;

  @Prop()
  startedAt?: Date;

  @Prop()
  completedAt?: Date;
}

export const StudentSessionSchema = SchemaFactory.createForClass(StudentSession);

StudentSessionSchema.index({ sessionToken: 1 }, { unique: true });
StudentSessionSchema.index({ lessonId: 1 });