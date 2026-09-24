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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.StudentsController = void 0;
const common_1 = require("@nestjs/common");
const students_service_1 = require("./students.service");
const join_lesson_dto_1 = require("./dto/join-lesson.dto");
let StudentsController = class StudentsController {
    constructor(studentsService) {
        this.studentsService = studentsService;
    }
    joinLesson(joinLessonDto) {
        return this.studentsService.joinLesson(joinLessonDto);
    }
    getSession(token) {
        return this.studentsService.getSession(token);
    }
    startSession(token) {
        return this.studentsService.startSession(token);
    }
    getCurrentQuestion(token) {
        return this.studentsService.getCurrentQuestion(token);
    }
    getSessionReview(token) {
        return this.studentsService.getSessionReview(token);
    }
    completeSession(token) {
        return this.studentsService.completeSession(token);
    }
};
exports.StudentsController = StudentsController;
__decorate([
    (0, common_1.Post)('join'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [join_lesson_dto_1.JoinLessonDto]),
    __metadata("design:returntype", void 0)
], StudentsController.prototype, "joinLesson", null);
__decorate([
    (0, common_1.Get)('session/:token'),
    __param(0, (0, common_1.Param)('token')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], StudentsController.prototype, "getSession", null);
__decorate([
    (0, common_1.Post)('session/:token/start'),
    __param(0, (0, common_1.Param)('token')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], StudentsController.prototype, "startSession", null);
__decorate([
    (0, common_1.Get)('session/:token/question'),
    __param(0, (0, common_1.Param)('token')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], StudentsController.prototype, "getCurrentQuestion", null);
__decorate([
    (0, common_1.Get)('session/:token/review'),
    __param(0, (0, common_1.Param)('token')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], StudentsController.prototype, "getSessionReview", null);
__decorate([
    (0, common_1.Post)('session/:token/complete'),
    __param(0, (0, common_1.Param)('token')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], StudentsController.prototype, "completeSession", null);
exports.StudentsController = StudentsController = __decorate([
    (0, common_1.Controller)('student'),
    __metadata("design:paramtypes", [students_service_1.StudentsService])
], StudentsController);
//# sourceMappingURL=students.controller.js.map