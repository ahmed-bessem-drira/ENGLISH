import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { TeachersService } from '../teachers/teachers.service';
import { CreateTeacherDto } from '../teachers/dto/create-teacher.dto';
import { LoginTeacherDto } from '../teachers/dto/login-teacher.dto';

@Injectable()
export class AuthService {
  constructor(
    private teachersService: TeachersService,
    private jwtService: JwtService,
  ) {}

  async register(createTeacherDto: CreateTeacherDto) {
    const teacher = await this.teachersService.create(createTeacherDto);
    const teacherId = (teacher as any)._id.toString();
    const payload = { sub: teacherId, email: teacher.email, role: (teacher as any).role || 'teacher' };
    return {
      access_token: this.jwtService.sign(payload),
      teacher: {
        id: teacherId,
        name: teacher.name,
        email: teacher.email,
        role: (teacher as any).role || 'teacher',
      },
    };
  }

  async login(loginTeacherDto: LoginTeacherDto) {
    const teacher = await this.teachersService.findByEmail(loginTeacherDto.email);
    if (!teacher) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await this.teachersService.validatePassword(
      loginTeacherDto.password,
      teacher.passwordHash,
    );
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const teacherId = (teacher as any)._id.toString();
    const payload = { sub: teacherId, email: teacher.email, role: (teacher as any).role || 'teacher' };
    return {
      access_token: this.jwtService.sign(payload),
      teacher: {
        id: teacherId,
        name: teacher.name,
        email: teacher.email,
        role: (teacher as any).role || 'teacher',
      },
    };
  }

  async validateTeacher(teacherId: string) {
    return this.teachersService.findById(teacherId);
  }
}