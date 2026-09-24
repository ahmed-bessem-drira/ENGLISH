import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { TeachersService } from '../../teachers/teachers.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private teachersService: TeachersService) {
    super({ usernameField: 'email' });
  }

  async validate(email: string, password: string): Promise<any> {
    const teacher = await this.teachersService.findByEmail(email);
    if (!teacher) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await this.teachersService.validatePassword(password, teacher.passwordHash);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return teacher;
  }
}