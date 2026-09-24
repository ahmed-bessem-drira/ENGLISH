import { IsNotEmpty, IsString, IsOptional, MaxLength } from 'class-validator';

export class CreateClassroomDto {
  @IsNotEmpty()
  @IsString()
  @MaxLength(100)
  name: string;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  description?: string;
}
