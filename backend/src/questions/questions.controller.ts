import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request } from '@nestjs/common';
import { QuestionsService } from './questions.service';
import { CreateQuestionDto } from './dto/create-question.dto';
import { UpdateQuestionDto } from './dto/update-question.dto';
import { ReorderQuestionsDto } from './dto/reorder-questions.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('questions')
@UseGuards(JwtAuthGuard)
export class QuestionsController {
  constructor(private readonly questionsService: QuestionsService) {}

  @Post()
  create(@Body() createQuestionDto: CreateQuestionDto, @Request() req) {
    return this.questionsService.create(createQuestionDto, req.user.id);
  }

  @Get('lesson/:lessonId')
  findByLesson(@Param('lessonId') lessonId: string, @Request() req) {
    return this.questionsService.findByLesson(lessonId, req.user.id);
  }

  @Post('lesson/:lessonId/reorder')
  reorder(@Param('lessonId') lessonId: string, @Body() reorderDto: ReorderQuestionsDto, @Request() req) {
    return this.questionsService.reorder(lessonId, reorderDto, req.user.id);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Request() req) {
    return this.questionsService.findOne(id, req.user.id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateQuestionDto: UpdateQuestionDto, @Request() req) {
    return this.questionsService.update(id, updateQuestionDto, req.user.id);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Request() req) {
    return this.questionsService.remove(id, req.user.id);
  }
}