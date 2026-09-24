import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ClassroomDocument = Classroom & Document;

@Schema({ timestamps: true })
export class Classroom {
  @Prop({ required: true })
  teacherId: string;

  @Prop({ required: true })
  name: string;

  @Prop()
  description: string;

  @Prop({ type: [String], default: [] })
  lessonIds: string[];

  // Un code d'acces par lecon rattachee : la meme lecon partagee
  // a N classes a N codes differents -> on sait de quelle classe vient l'eleve.
  @Prop({
    type: [{ lessonId: { type: String }, accessCode: { type: String } }],
    default: [],
  })
  lessonCodes: { lessonId: string; accessCode: string }[];
}

export const ClassroomSchema = SchemaFactory.createForClass(Classroom);

ClassroomSchema.index({ teacherId: 1 });
