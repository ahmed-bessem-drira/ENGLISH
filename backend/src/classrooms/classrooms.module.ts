import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ClassroomsService } from './classrooms.service';
import { ClassroomsController } from './classrooms.controller';
import { Classroom, ClassroomSchema } from './schemas/classroom.schema';
import { Lesson, LessonSchema } from '../lessons/schemas/lesson.schema';
import { LessonsModule } from '../lessons/lessons.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Classroom.name, schema: ClassroomSchema },
      { name: Lesson.name, schema: LessonSchema },
    ]),
    LessonsModule,
  ],
  controllers: [ClassroomsController],
  providers: [ClassroomsService],
  exports: [ClassroomsService],
})
export class ClassroomsModule {}
