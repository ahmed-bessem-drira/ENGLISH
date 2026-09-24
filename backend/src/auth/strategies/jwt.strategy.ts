import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { TeachersService } from '../../teachers/teachers.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private configService: ConfigService,
    private teachersService: TeachersService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_SECRET') || 'english-classroom-secret-key-2024',
    });
  }

  async validate(payload: any) {
    try {
      const teacher = await this.teachersService.findById(payload.sub);
      const teacherId = (teacher as any)._id.toString();
      return { id: teacherId, email: teacher.email, name: teacher.name, role: (teacher as any).role || payload.role || 'teacher' };
    } catch {
      throw new UnauthorizedException();
    }
  }
}