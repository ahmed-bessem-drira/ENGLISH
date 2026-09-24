import { IsBoolean, IsNumber, IsOptional, IsString, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class ReviewAnswerDto {
  @IsBoolean()
  isCorrect: boolean;

  @IsNumber()
  @Min(0)
  @Type(() => Number)
  points: number;

  @IsOptional()
  @IsString()
  teacherFeedback?: string;
}
