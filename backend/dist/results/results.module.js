"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ResultsModule = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const results_service_1 = require("./results.service");
const results_controller_1 = require("./results.controller");
const student_session_schema_1 = require("../students/schemas/student-session.schema");
const answer_schema_1 = require("../answers/schemas/answer.schema");
const question_schema_1 = require("../questions/schemas/question.schema");
const lesson_schema_1 = require("../lessons/schemas/lesson.schema");
const classroom_schema_1 = require("../classrooms/schemas/classroom.schema");
const answers_module_1 = require("../answers/answers.module");
let ResultsModule = class ResultsModule {
};
exports.ResultsModule = ResultsModule;
exports.ResultsModule = ResultsModule = __decorate([
    (0, common_1.Module)({
        imports: [
            mongoose_1.MongooseModule.forFeature([
                { name: student_session_schema_1.StudentSession.name, schema: student_session_schema_1.StudentSessionSchema },
                { name: answer_schema_1.Answer.name, schema: answer_schema_1.AnswerSchema },
                { name: question_schema_1.Question.name, schema: question_schema_1.QuestionSchema },
                { name: lesson_schema_1.Lesson.name, schema: lesson_schema_1.LessonSchema },
                { name: classroom_schema_1.Classroom.name, schema: classroom_schema_1.ClassroomSchema },
            ]),
            answers_module_1.AnswersModule,
        ],
        controllers: [results_controller_1.ResultsController],
        providers: [results_service_1.ResultsService],
        exports: [results_service_1.ResultsService],
    })
], ResultsModule);
//# sourceMappingURL=results.module.js.map