import { IsNotEmpty, IsString, IsIn, IsArray, IsOptional, IsNumber, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateQuestionDto {
  @IsNotEmpty()
  @IsString()
  lessonId: string;

  @IsNotEmpty()
  @IsIn(['multiple_choice', 'written'])
  type: string;

  @IsNotEmpty()
  @IsString()
  text: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  options?: string[];

  @IsOptional()
  @IsString()
  correctAnswer?: string;

  @IsOptional()
  @IsString()
  expectedAnswer?: string;

  @IsOptional()
  @IsString()
  correction?: string;

  @IsOptional()
  @IsString()
  explanation?: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Type(() => Number)
  points?: number;
}