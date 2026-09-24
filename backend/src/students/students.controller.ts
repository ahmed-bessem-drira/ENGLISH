import { Controller, Post, Get, Body, Param, UseGuards, Request } from '@nestjs/common';
import { StudentsService } from './students.service';
import { JoinLessonDto } from './dto/join-lesson.dto';

@Controller('student')
export class StudentsController {
  constructor(private readonly studentsService: StudentsService) {}

  @Post('join')
  joinLesson(@Body() joinLessonDto: JoinLessonDto) {
    return this.studentsService.joinLesson(joinLessonDto);
  }

  @Get('session/:token')
  getSession(@Param('token') token: string) {
    return this.studentsService.getSession(token);
  }

  @Post('session/:token/start')
  startSession(@Param('token') token: string) {
    return this.studentsService.startSession(token);
  }

  @Get('session/:token/question')
  getCurrentQuestion(@Param('token') token: string) {
    return this.studentsService.getCurrentQuestion(token);
  }

  @Get('session/:token/review')
  getSessionReview(@Param('token') token: string) {
    return this.studentsService.getSessionReview(token);
  }

  @Post('session/:token/complete')
  completeSession(@Param('token') token: string) {
    return this.studentsService.completeSession(token);
  }
}