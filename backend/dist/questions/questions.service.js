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
exports.QuestionsService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const question_schema_1 = require("./schemas/question.schema");
const lessons_service_1 = require("../lessons/lessons.service");
let QuestionsService = class QuestionsService {
    constructor(questionModel, lessonsService) {
        this.questionModel = questionModel;
        this.lessonsService = lessonsService;
    }
    async create(createQuestionDto, teacherId) {
        await this.lessonsService.findOne(createQuestionDto.lessonId, teacherId);
        const lastQuestion = await this.questionModel
            .findOne({ lessonId: createQuestionDto.lessonId })
            .sort({ order: -1 });
        const order = lastQuestion ? lastQuestion.order + 1 : 0;
        const question = new this.questionModel({
            ...createQuestionDto,
            order,
        });
        return question.save();
    }
    async findByLesson(lessonId, teacherId) {
        if (teacherId) {
            await this.lessonsService.findOne(lessonId, teacherId);
        }
        return this.questionModel.find({ lessonId }).sort({ order: 1 });
    }
    async findOne(id, teacherId) {
        const question = await this.questionModel.findById(id);
        if (!question) {
            throw new common_1.NotFoundException('Question not found');
        }
        if (teacherId) {
            await this.lessonsService.findOne(question.lessonId, teacherId);
        }
        return question;
    }
    async update(id, updateQuestionDto, teacherId) {
        await this.findOne(id, teacherId);
        const { lessonId, ...safeUpdate } = updateQuestionDto;
        return this.questionModel.findByIdAndUpdate(id, safeUpdate, { new: true });
    }
    async remove(id, teacherId) {
        const question = await this.findOne(id, teacherId);
        await this.questionModel.findByIdAndDelete(id);
    }
    async reorder(lessonId, reorderDto, teacherId) {
        await this.lessonsService.findOne(lessonId, teacherId);
        for (const { questionId, order } of reorderDto.questions) {
            await this.questionModel.updateOne({ _id: questionId, lessonId }, { order });
        }
    }
    async findByQuestionIds(questionIds) {
        return this.questionModel.find({ _id: { $in: questionIds } });
    }
};
exports.QuestionsService = QuestionsService;
exports.QuestionsService = QuestionsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(question_schema_1.Question.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        lessons_service_1.LessonsService])
], QuestionsService);
//# sourceMappingURL=questions.service.js.map