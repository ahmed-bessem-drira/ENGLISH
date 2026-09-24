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
exports.ResultsService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const student_session_schema_1 = require("../students/schemas/student-session.schema");
const answer_schema_1 = require("../answers/schemas/answer.schema");
const question_schema_1 = require("../questions/schemas/question.schema");
const lesson_schema_1 = require("../lessons/schemas/lesson.schema");
const classroom_schema_1 = require("../classrooms/schemas/classroom.schema");
const answers_service_1 = require("../answers/answers.service");
let ResultsService = class ResultsService {
    constructor(studentSessionModel, answerModel, questionModel, lessonModel, classroomModel, answersService) {
        this.studentSessionModel = studentSessionModel;
        this.answerModel = answerModel;
        this.questionModel = questionModel;
        this.lessonModel = lessonModel;
        this.classroomModel = classroomModel;
        this.answersService = answersService;
    }
    async getLessonResults(lessonId, teacherId, classroomId) {
        const lesson = await this.lessonModel.findById(lessonId);
        if (!lesson) {
            throw new common_1.NotFoundException('Lesson not found');
        }
        if (lesson.teacherId !== teacherId) {
            throw new common_1.ForbiddenException('You do not have access to this lesson');
        }
        let className = null;
        const sessionFilter = { lessonId };
        if (classroomId) {
            if (!(0, mongoose_2.isValidObjectId)(classroomId)) {
                throw new common_1.NotFoundException('Class not found');
            }
            const classroom = await this.classroomModel.findById(classroomId);
            if (!classroom || classroom.teacherId !== teacherId) {
                throw new common_1.NotFoundException('Class not found');
            }
            sessionFilter.classroomId = classroomId;
            className = classroom.name;
        }
        const sessions = await this.studentSessionModel.find(sessionFilter).sort({ createdAt: -1 });
        const results = await Promise.all(sessions.map(async (session) => {
            const score = await this.answersService.calculateSessionScore(session._id.toString());
            return {
                sessionId: session._id.toString(),
                studentName: session.studentName,
                status: session.status,
                className: session.className || null,
                score: score.earnedPoints,
                totalPoints: score.totalPoints,
                percentage: score.percentage,
                pendingCount: score.pendingCount || 0,
                startedAt: session.startedAt,
                completedAt: session.completedAt,
            };
        }));
        const completedCount = results.filter(r => r.status === 'COMPLETED').length;
        const averageScore = completedCount > 0
            ? Math.round(results.filter(r => r.status === 'COMPLETED').reduce((sum, r) => sum + r.percentage, 0) / completedCount)
            : 0;
        return {
            lesson: {
                id: lesson._id.toString(),
                title: lesson.title,
                accessCode: lesson.accessCode,
            },
            classroom: classroomId ? { id: classroomId, name: className } : null,
            statistics: {
                totalParticipants: sessions.length,
                completedCount,
                averageScore,
            },
            results,
        };
    }
    async getSessionDetails(sessionId, teacherId, lessonId) {
        const session = await this.studentSessionModel.findById(sessionId);
        if (!session) {
            throw new common_1.NotFoundException('Session not found');
        }
        if (lessonId && session.lessonId.toString() !== lessonId.toString()) {
            throw new common_1.ForbiddenException('Session does not belong to this lesson');
        }
        const lesson = await this.lessonModel.findById(session.lessonId);
        if (!lesson || lesson.teacherId !== teacherId) {
            throw new common_1.ForbiddenException('You do not have access to this session');
        }
        const answers = await this.answerModel.find({ sessionId }).sort({ submittedAt: 1 });
        const questions = await this.questionModel.find({ lessonId: session.lessonId }).sort({ order: 1 });
        const questionMap = new Map(questions.map(q => [q._id.toString(), q]));
        const answerDetails = answers.map(answer => {
            const question = questionMap.get(answer.questionId);
            return {
                id: answer._id.toString(),
                questionId: answer.questionId,
                questionText: question?.text || '',
                questionType: question?.type || '',
                studentAnswer: answer.answer,
                correctAnswer: question?.correctAnswer || question?.expectedAnswer || '',
                isCorrect: answer.isCorrect,
                points: answer.points,
                maxPoints: question?.points || 1,
                teacherFeedback: answer.teacherFeedback,
                reviewedByTeacher: answer.reviewedByTeacher,
                submittedAt: answer.submittedAt,
            };
        });
        const score = await this.answersService.calculateSessionScore(sessionId);
        return {
            session: {
                id: session._id.toString(),
                studentName: session.studentName,
                status: session.status,
                className: session.className || null,
                startedAt: session.startedAt,
                completedAt: session.completedAt,
            },
            score,
            answers: answerDetails,
        };
    }
    async reviewAnswer(answerId, teacherId, reviewData, lessonId) {
        const answer = await this.answerModel.findById(answerId);
        if (!answer) {
            throw new common_1.NotFoundException('Answer not found');
        }
        const session = await this.studentSessionModel.findById(answer.sessionId);
        if (!session) {
            throw new common_1.NotFoundException('Session not found');
        }
        if (lessonId && session.lessonId.toString() !== lessonId.toString()) {
            throw new common_1.ForbiddenException('Answer does not belong to this lesson');
        }
        if (typeof reviewData.points !== 'number' || reviewData.points < 0) {
            throw new common_1.BadRequestException('Points must be a positive number');
        }
        const lesson = await this.lessonModel.findById(session.lessonId);
        if (!lesson || lesson.teacherId !== teacherId) {
            throw new common_1.ForbiddenException('You do not have access to this answer');
        }
        return this.answersService.updateAnswer(answerId, {
            ...reviewData,
            reviewedByTeacher: true,
        });
    }
    async deleteLessonResults(lessonId, teacherId) {
        const lesson = await this.lessonModel.findById(lessonId);
        if (!lesson) {
            throw new common_1.NotFoundException('Lesson not found');
        }
        if (lesson.teacherId !== teacherId) {
            throw new common_1.ForbiddenException('You do not have access to this lesson');
        }
        const sessions = await this.studentSessionModel.find({ lessonId });
        const sessionIds = sessions.map((s) => s._id.toString());
        const deletedAnswers = sessionIds.length > 0
            ? (await this.answerModel.deleteMany({ sessionId: { $in: sessionIds } })).deletedCount
            : 0;
        const deletedSessions = (await this.studentSessionModel.deleteMany({ lessonId })).deletedCount;
        return { deletedSessions, deletedAnswers };
    }
};
exports.ResultsService = ResultsService;
exports.ResultsService = ResultsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(student_session_schema_1.StudentSession.name)),
    __param(1, (0, mongoose_1.InjectModel)(answer_schema_1.Answer.name)),
    __param(2, (0, mongoose_1.InjectModel)(question_schema_1.Question.name)),
    __param(3, (0, mongoose_1.InjectModel)(lesson_schema_1.Lesson.name)),
    __param(4, (0, mongoose_1.InjectModel)(classroom_schema_1.Classroom.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model,
        answers_service_1.AnswersService])
], ResultsService);
//# sourceMappingURL=results.service.js.map