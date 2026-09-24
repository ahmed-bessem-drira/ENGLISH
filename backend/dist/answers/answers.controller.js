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
exports.AnswersController = void 0;
const common_1 = require("@nestjs/common");
const answers_service_1 = require("./answers.service");
const submit_answer_dto_1 = require("./dto/submit-answer.dto");
let AnswersController = class AnswersController {
    constructor(answersService) {
        this.answersService = answersService;
    }
    submitAnswer(token, submitAnswerDto) {
        return this.answersService.submitAnswer(token, submitAnswerDto);
    }
};
exports.AnswersController = AnswersController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Param)('token')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, submit_answer_dto_1.SubmitAnswerDto]),
    __metadata("design:returntype", void 0)
], AnswersController.prototype, "submitAnswer", null);
exports.AnswersController = AnswersController = __decorate([
    (0, common_1.Controller)('student/session/:token/answer'),
    __metadata("design:paramtypes", [answers_service_1.AnswersService])
], AnswersController);
//# sourceMappingURL=answers.controller.js.map