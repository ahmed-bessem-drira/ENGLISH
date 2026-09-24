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
exports.LessonSchema = exports.Lesson = void 0;
const mongoose_1 = require("@nestjs/mongoose");
let Lesson = class Lesson {
};
exports.Lesson = Lesson;
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], Lesson.prototype, "teacherId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], Lesson.prototype, "title", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], Lesson.prototype, "description", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], Lesson.prototype, "category", void 0);
__decorate([
    (0, mongoose_1.Prop)({ enum: ['Beginner', 'Elementary', 'Intermediate', 'Upper Intermediate', 'Advanced'] }),
    __metadata("design:type", String)
], Lesson.prototype, "difficulty", void 0);
__decorate([
    (0, mongoose_1.Prop)({ enum: ['Draft', 'Active', 'Archived'], default: 'Draft' }),
    __metadata("design:type", String)
], Lesson.prototype, "status", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, unique: true }),
    __metadata("design:type", String)
], Lesson.prototype, "accessCode", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: {
            showCorrectionImmediately: { type: Boolean, default: false },
            showFinalScore: { type: Boolean, default: true },
            showCorrectAnswersAtEnd: { type: Boolean, default: true },
            allowRetry: { type: Boolean, default: false },
            allowPreviousQuestion: { type: Boolean, default: false },
            shuffleQuestions: { type: Boolean, default: false },
            shuffleOptions: { type: Boolean, default: false },
        },
        default: {
            showCorrectionImmediately: false,
            showFinalScore: true,
            showCorrectAnswersAtEnd: true,
            allowRetry: false,
            allowPreviousQuestion: false,
            shuffleQuestions: false,
            shuffleOptions: false,
        },
    }),
    __metadata("design:type", Object)
], Lesson.prototype, "settings", void 0);
exports.Lesson = Lesson = __decorate([
    (0, mongoose_1.Schema)({ timestamps: true })
], Lesson);
exports.LessonSchema = mongoose_1.SchemaFactory.createForClass(Lesson);
exports.LessonSchema.index({ teacherId: 1 });
exports.LessonSchema.index({ accessCode: 1 }, { unique: true });
//# sourceMappingURL=lesson.schema.js.map