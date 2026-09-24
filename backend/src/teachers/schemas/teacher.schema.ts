import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type TeacherDocument = Teacher & Document;

@Schema({ timestamps: true })
export class Teacher {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  passwordHash: string;

  @Prop()
  avatar?: string;

  @Prop({ default: 'teacher' })
  role: string;
}

export const TeacherSchema = SchemaFactory.createForClass(Teacher);

TeacherSchema.index({ email: 1 }, { unique: true });