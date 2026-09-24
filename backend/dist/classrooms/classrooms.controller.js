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
exports.ClassroomsController = void 0;
const common_1 = require("@nestjs/common");
const classrooms_service_1 = require("./classrooms.service");
const create_classroom_dto_1 = require("./dto/create-classroom.dto");
const update_classroom_dto_1 = require("./dto/update-classroom.dto");
const attach_lesson_dto_1 = require("./dto/attach-lesson.dto");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
let ClassroomsController = class ClassroomsController {
    constructor(classroomsService) {
        this.classroomsService = classroomsService;
    }
    create(createClassroomDto, req) {
        return this.classroomsService.create(createClassroomDto, req.user.id);
    }
    findAll(req) {
        return this.classroomsService.findAll(req.user.id);
    }
    findOne(id, req) {
        return this.classroomsService.findOne(id, req.user.id);
    }
    update(id, updateClassroomDto, req) {
        return this.classroomsService.update(id, updateClassroomDto, req.user.id);
    }
    remove(id, req) {
        return this.classroomsService.remove(id, req.user.id);
    }
    attachLesson(id, attachLessonDto, req) {
        return this.classroomsService.attachLesson(id, attachLessonDto.lessonId, req.user.id);
    }
    detachLesson(id, lessonId, req) {
        return this.classroomsService.detachLesson(id, lessonId, req.user.id);
    }
    regenerateLessonCode(id, lessonId, req) {
        return this.classroomsService.regenerateLessonCode(id, lessonId, req.user.id);
    }
};
exports.ClassroomsController = ClassroomsController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_classroom_dto_1.CreateClassroomDto, Object]),
    __metadata("design:returntype", void 0)
], ClassroomsController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], ClassroomsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], ClassroomsController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_classroom_dto_1.UpdateClassroomDto, Object]),
    __metadata("design:returntype", void 0)
], ClassroomsController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], ClassroomsController.prototype, "remove", null);
__decorate([
    (0, common_1.Post)(':id/lessons'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, attach_lesson_dto_1.AttachLessonDto, Object]),
    __metadata("design:returntype", void 0)
], ClassroomsController.prototype, "attachLesson", null);
__decorate([
    (0, common_1.Delete)(':id/lessons/:lessonId'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Param)('lessonId')),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", void 0)
], ClassroomsController.prototype, "detachLesson", null);
__decorate([
    (0, common_1.Post)(':id/lessons/:lessonId/code'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Param)('lessonId')),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", void 0)
], ClassroomsController.prototype, "regenerateLessonCode", null);
exports.ClassroomsController = ClassroomsController = __decorate([
    (0, common_1.Controller)('classrooms'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [classrooms_service_1.ClassroomsService])
], ClassroomsController);
//# sourceMappingURL=classrooms.controller.js.map