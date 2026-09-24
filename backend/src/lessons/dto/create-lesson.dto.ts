import { IsNotEmpty, IsString, IsIn, IsOptional } from 'class-validator';

export class CreateLessonDto {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  category?: string;

  @IsOptional()
  @IsIn(['Beginner', 'Elementary', 'Intermediate', 'Upper Intermediate', 'Advanced'])
  difficulty?: string;

  @IsOptional()
  @IsIn(['Draft', 'Active', 'Archived'])
  status?: string;
}