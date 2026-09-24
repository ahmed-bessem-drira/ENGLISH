import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AnswersService } from './answers.service';
import { AnswersController } from './answers.controller';
import { Answer, AnswerSchema } from './schemas/answer.schema';
import { QuestionsModule } from '../questions/questions.module';
import { StudentSession, StudentSessionSchema } from '../students/schemas/student-session.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Answer.name, schema: AnswerSchema },
      { name: StudentSession.name, schema: StudentSessionSchema }
    ]),
    QuestionsModule
  ],
  controllers: [AnswersController],
  providers: [AnswersService],
  exports: [AnswersService],
})
export class AnswersModule {}