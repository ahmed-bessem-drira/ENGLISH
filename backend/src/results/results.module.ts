import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ResultsService } from './results.service';
import { ResultsController } from './results.controller';
import { StudentSession, StudentSessionSchema } from '../students/schemas/student-session.schema';
import { Answer, AnswerSchema } from '../answers/schemas/answer.schema';
import { Question, QuestionSchema } from '../questions/schemas/question.schema';
import { Lesson, LessonSchema } from '../lessons/schemas/lesson.schema';
import { Classroom, ClassroomSchema } from '../classrooms/schemas/classroom.schema';
import { AnswersModule } from '../answers/answers.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: StudentSession.name, schema: StudentSessionSchema },
      { name: Answer.name, schema: AnswerSchema },
      { name: Question.name, schema: QuestionSchema },
      { name: Lesson.name, schema: LessonSchema },
      { name: Classroom.name, schema: ClassroomSchema },
    ]),
    AnswersModule,
  ],
  controllers: [ResultsController],
  providers: [ResultsService],
  exports: [ResultsService],
})
export class ResultsModule {}