import { Controller, Post, Body, Param } from '@nestjs/common';
import { AnswersService } from './answers.service';
import { SubmitAnswerDto } from './dto/submit-answer.dto';

@Controller('student/session/:token/answer')
export class AnswersController {
  constructor(private readonly answersService: AnswersService) {}

  @Post()
  submitAnswer(@Param('token') token: string, @Body() submitAnswerDto: SubmitAnswerDto) {
    return this.answersService.submitAnswer(token, submitAnswerDto);
  }
}