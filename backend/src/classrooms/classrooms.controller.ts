import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request } from '@nestjs/common';
import { ClassroomsService } from './classrooms.service';
import { CreateClassroomDto } from './dto/create-classroom.dto';
import { UpdateClassroomDto } from './dto/update-classroom.dto';
import { AttachLessonDto } from './dto/attach-lesson.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('classrooms')
@UseGuards(JwtAuthGuard)
export class ClassroomsController {
  constructor(private readonly classroomsService: ClassroomsService) {}

  @Post()
  create(@Body() createClassroomDto: CreateClassroomDto, @Request() req) {
    return this.classroomsService.create(createClassroomDto, req.user.id);
  }

  @Get()
  findAll(@Request() req) {
    return this.classroomsService.findAll(req.user.id);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Request() req) {
    return this.classroomsService.findOne(id, req.user.id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateClassroomDto: UpdateClassroomDto, @Request() req) {
    return this.classroomsService.update(id, updateClassroomDto, req.user.id);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Request() req) {
    return this.classroomsService.remove(id, req.user.id);
  }

  @Post(':id/lessons')
  attachLesson(@Param('id') id: string, @Body() attachLessonDto: AttachLessonDto, @Request() req) {
    return this.classroomsService.attachLesson(id, attachLessonDto.lessonId, req.user.id);
  }

  @Delete(':id/lessons/:lessonId')
  detachLesson(@Param('id') id: string, @Param('lessonId') lessonId: string, @Request() req) {
    return this.classroomsService.detachLesson(id, lessonId, req.user.id);
  }

  @Post(':id/lessons/:lessonId/code')
  regenerateLessonCode(@Param('id') id: string, @Param('lessonId') lessonId: string, @Request() req) {
    return this.classroomsService.regenerateLessonCode(id, lessonId, req.user.id);
  }
}
