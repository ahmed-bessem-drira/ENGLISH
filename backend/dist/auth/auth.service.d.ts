import { JwtService } from '@nestjs/jwt';
import { TeachersService } from '../teachers/teachers.service';
import { CreateTeacherDto } from '../teachers/dto/create-teacher.dto';
import { LoginTeacherDto } from '../teachers/dto/login-teacher.dto';
export declare class AuthService {
    private teachersService;
    private jwtService;
    constructor(teachersService: TeachersService, jwtService: JwtService);
    register(createTeacherDto: CreateTeacherDto): Promise<{
        access_token: string;
        teacher: {
            id: any;
            name: string;
            email: string;
            role: any;
        };
    }>;
    login(loginTeacherDto: LoginTeacherDto): Promise<{
        access_token: string;
        teacher: {
            id: any;
            name: string;
            email: string;
            role: any;
        };
    }>;
    validateTeacher(teacherId: string): Promise<import("../teachers/schemas/teacher.schema").Teacher>;
}
