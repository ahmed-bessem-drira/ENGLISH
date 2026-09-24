"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const teachers_service_1 = require("../teachers/teachers.service");
let AuthService = class AuthService {
    constructor(teachersService, jwtService) {
        this.teachersService = teachersService;
        this.jwtService = jwtService;
    }
    async register(createTeacherDto) {
        const teacher = await this.teachersService.create(createTeacherDto);
        const teacherId = teacher._id.toString();
        const payload = { sub: teacherId, email: teacher.email, role: teacher.role || 'teacher' };
        return {
            access_token: this.jwtService.sign(payload),
            teacher: {
                id: teacherId,
                name: teacher.name,
                email: teacher.email,
                role: teacher.role || 'teacher',
            },
        };
    }
    async login(loginTeacherDto) {
        const teacher = await this.teachersService.findByEmail(loginTeacherDto.email);
        if (!teacher) {
            throw new common_1.UnauthorizedException('Invalid credentials');
        }
        const isPasswordValid = await this.teachersService.validatePassword(loginTeacherDto.password, teacher.passwordHash);
        if (!isPasswordValid) {
            throw new common_1.UnauthorizedException('Invalid credentials');
        }
        const teacherId = teacher._id.toString();
        const payload = { sub: teacherId, email: teacher.email, role: teacher.role || 'teacher' };
        return {
            access_token: this.jwtService.sign(payload),
            teacher: {
                id: teacherId,
                name: teacher.name,
                email: teacher.email,
                role: teacher.role || 'teacher',
            },
        };
    }
    async validateTeacher(teacherId) {
        return this.teachersService.findById(teacherId);
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [teachers_service_1.TeachersService,
        jwt_1.JwtService])
], AuthService);
//# sourceMappingURL=auth.service.js.map