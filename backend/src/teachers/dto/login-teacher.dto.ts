import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class LoginTeacherDto {
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  password: string;
}