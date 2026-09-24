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
exports.ResultsController = void 0;
const common_1 = require("@nestjs/common");
const results_service_1 = require("./results.service");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const review_answer_dto_1 = require("./dto/review-answer.dto");
let ResultsController = class ResultsController {
    constructor(resultsService) {
        this.resultsService = resultsService;
    }
    getLessonResults(lessonId, req, classroomId) {
        return this.resultsService.getLessonResults(lessonId, req.user.id, classroomId || undefined);
    }
    getSessionDetails(lessonId, sessionId, req) {
        return this.resultsService.getSessionDetails(sessionId, req.user.id, lessonId);
    }
    reviewAnswer(lessonId, answerId, reviewData, req) {
        return this.resultsService.reviewAnswer(answerId, req.user.id, reviewData, lessonId);
    }
    deleteLessonResults(lessonId, req) {
        return this.resultsService.deleteLessonResults(lessonId, req.user.id);
    }
};
exports.ResultsController = ResultsController;
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Param)('lessonId')),
    __param(1, (0, common_1.Request)()),
    __param(2, (0, common_1.Query)('classroomId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, String]),
    __metadata("design:returntype", void 0)
], ResultsController.prototype, "getLessonResults", null);
__decorate([
    (0, common_1.Get)('session/:sessionId'),
    __param(0, (0, common_1.Param)('lessonId')),
    __param(1, (0, common_1.Param)('sessionId')),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", void 0)
], ResultsController.prototype, "getSessionDetails", null);
__decorate([
    (0, common_1.Post)('answer/:answerId/review'),
    __param(0, (0, common_1.Param)('lessonId')),
    __param(1, (0, common_1.Param)('answerId')),
    __param(2, (0, common_1.Body)()),
    __param(3, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, review_answer_dto_1.ReviewAnswerDto, Object]),
    __metadata("design:returntype", void 0)
], ResultsController.prototype, "reviewAnswer", null);
__decorate([
    (0, common_1.Delete)(),
    __param(0, (0, common_1.Param)('lessonId')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], ResultsController.prototype, "deleteLessonResults", null);
exports.ResultsController = ResultsController = __decorate([
    (0, common_1.Controller)('lessons/:lessonId/results'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [results_service_1.ResultsService])
], ResultsController);
//# sourceMappingURL=results.controller.js.map