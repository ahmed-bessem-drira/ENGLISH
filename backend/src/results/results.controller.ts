import { Controller, Get, Post, Body, Param, UseGuards, Request, Delete, Query } from '@nestjs/common';
import { ResultsService } from './results.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ReviewAnswerDto } from './dto/review-answer.dto';

@Controller('lessons/:lessonId/results')
@UseGuards(JwtAuthGuard)
export class ResultsController {
  constructor(private readonly resultsService: ResultsService) {}

  @Get()
  getLessonResults(@Param('lessonId') lessonId: string, @Request() req, @Query('classroomId') classroomId?: string) {
    return this.resultsService.getLessonResults(lessonId, req.user.id, classroomId || undefined);
  }

  @Get('session/:sessionId')
  getSessionDetails(@Param('lessonId') lessonId: string, @Param('sessionId') sessionId: string, @Request() req) {
    return this.resultsService.getSessionDetails(sessionId, req.user.id, lessonId);
  }

  @Post('answer/:answerId/review')
  reviewAnswer(@Param('lessonId') lessonId: string, @Param('answerId') answerId: string, @Body() reviewData: ReviewAnswerDto, @Request() req) {
    return this.resultsService.reviewAnswer(answerId, req.user.id, reviewData, lessonId);
  }

  @Delete()
  deleteLessonResults(@Param('lessonId') lessonId: string, @Request() req) {
    return this.resultsService.deleteLessonResults(lessonId, req.user.id);
  }
}