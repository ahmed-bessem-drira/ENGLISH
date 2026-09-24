"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const mongoose_1 = require("@nestjs/mongoose");
const auth_module_1 = require("./auth/auth.module");
const teachers_module_1 = require("./teachers/teachers.module");
const lessons_module_1 = require("./lessons/lessons.module");
const questions_module_1 = require("./questions/questions.module");
const students_module_1 = require("./students/students.module");
const answers_module_1 = require("./answers/answers.module");
const results_module_1 = require("./results/results.module");
const classrooms_module_1 = require("./classrooms/classrooms.module");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({
                isGlobal: true,
            }),
            mongoose_1.MongooseModule.forRoot(process.env.MONGODB_URI || 'mongodb://localhost:27017/english-classroom', {
                serverSelectionTimeoutMS: 5000,
                socketTimeoutMS: 45000,
            }),
            auth_module_1.AuthModule,
            teachers_module_1.TeachersModule,
            lessons_module_1.LessonsModule,
            questions_module_1.QuestionsModule,
            students_module_1.StudentsModule,
            answers_module_1.AnswersModule,
            results_module_1.ResultsModule,
            classrooms_module_1.ClassroomsModule,
        ],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map