import { AuthService } from './auth.service';
import { CreateTeacherDto } from '../teachers/dto/create-teacher.dto';
import { LoginTeacherDto } from '../teachers/dto/login-teacher.dto';
export declare class AuthController {
    private authService;
    constructor(authService: AuthService);
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
    getProfile(req: any): Promise<any>;
}
