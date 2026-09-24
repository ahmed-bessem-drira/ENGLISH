import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request } from '@nestjs/common';
import { LessonsService } from './lessons.service';
import { CreateLessonDto } from './dto/create-lesson.dto';
import { UpdateLessonDto } from './dto/update-lesson.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('lessons')
@UseGuards(JwtAuthGuard)
export class LessonsController {
  constructor(private readonly lessonsService: LessonsService) {}

  @Post()
  create(@Body() createLessonDto: CreateLessonDto, @Request() req) {
    return this.lessonsService.create(createLessonDto, req.user.id);
  }

  @Get()
  findAll(@Request() req) {
    return this.lessonsService.findAll(req.user.id);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Request() req) {
    return this.lessonsService.findOne(id, req.user.id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateLessonDto: UpdateLessonDto, @Request() req) {
    return this.lessonsService.update(id, updateLessonDto, req.user.id);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Request() req) {
    return this.lessonsService.remove(id, req.user.id);
  }

  @Post(':id/generate-code')
  generateCode(@Param('id') id: string, @Request() req) {
    return this.lessonsService.generateAccessCode(id, req.user.id);
  }
}