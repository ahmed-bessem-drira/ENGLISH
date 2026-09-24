import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { StudentsService } from './students.service';
import { StudentsController } from './students.controller';
import { StudentSession, StudentSessionSchema } from './schemas/student-session.schema';
import { LessonsModule } from '../lessons/lessons.module';
import { QuestionsModule } from '../questions/questions.module';
import { AnswersModule } from '../answers/answers.module';
import { ClassroomsModule } from '../classrooms/classrooms.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: StudentSession.name, schema: StudentSessionSchema }]),
    LessonsModule,
    QuestionsModule,
    AnswersModule,
    ClassroomsModule,
  ],
  controllers: [StudentsController],
  providers: [StudentsService],
  exports: [StudentsService],
})
export class StudentsModule {}