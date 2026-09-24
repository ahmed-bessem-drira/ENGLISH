import { Controller, Post, Body, Get, UseGuards, Request } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateTeacherDto } from '../teachers/dto/create-teacher.dto';
import { LoginTeacherDto } from '../teachers/dto/login-teacher.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  async register(@Body() createTeacherDto: CreateTeacherDto) {
    return this.authService.register(createTeacherDto);
  }

  @Post('login')
  async login(@Body() loginTeacherDto: LoginTeacherDto) {
    return this.authService.login(loginTeacherDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  async getProfile(@Request() req) {
    return req.user;
  }
}