import { IsNotEmpty, IsString } from 'class-validator';
import { Transform } from 'class-transformer';

export class JoinLessonDto {
  @IsNotEmpty()
  @IsString()
  @Transform(({ value }) => typeof value === 'string' ? value.trim().toUpperCase() : value)
  accessCode: string;

  @IsNotEmpty()
  @IsString()
  @Transform(({ value }) => typeof value === 'string' ? value.trim() : value)
  studentName: string;
}