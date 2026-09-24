import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './auth/auth.module';
import { TeachersModule } from './teachers/teachers.module';
import { LessonsModule } from './lessons/lessons.module';
import { QuestionsModule } from './questions/questions.module';
import { StudentsModule } from './students/students.module';
import { AnswersModule } from './answers/answers.module';
import { ResultsModule } from './results/results.module';
import { ClassroomsModule } from './classrooms/classrooms.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MongooseModule.forRoot(process.env.MONGODB_URI || 'mongodb://localhost:27017/english-classroom', {
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    }),
    AuthModule,
    TeachersModule,
    LessonsModule,
    QuestionsModule,
    StudentsModule,
    AnswersModule,
    ResultsModule,
    ClassroomsModule,
  ],
})
export class AppModule {}