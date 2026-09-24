import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { LessonsService } from './lessons.service';
import { LessonsController } from './lessons.controller';
import { Lesson, LessonSchema } from './schemas/lesson.schema';
import { Classroom, ClassroomSchema } from '../classrooms/schemas/classroom.schema';
import { Question, QuestionSchema } from '../questions/schemas/question.schema';
import { StudentSession, StudentSessionSchema } from '../students/schemas/student-session.schema';
import { Answer, AnswerSchema } from '../answers/schemas/answer.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Lesson.name, schema: LessonSchema },
      { name: Classroom.name, schema: ClassroomSchema },
      { name: Question.name, schema: QuestionSchema },
      { name: StudentSession.name, schema: StudentSessionSchema },
      { name: Answer.name, schema: AnswerSchema },
    ]),
  ],
  controllers: [LessonsController],
  providers: [LessonsService],
  exports: [LessonsService],
})
export class LessonsModule {}