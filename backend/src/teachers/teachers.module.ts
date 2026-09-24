import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TeachersService } from './teachers.service';
import { Teacher, TeacherSchema } from './schemas/teacher.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: Teacher.name, schema: TeacherSchema }])],
  providers: [TeachersService],
  exports: [TeachersService],
})
export class TeachersModule {}