"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.StudentsService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const student_session_schema_1 = require("./schemas/student-session.schema");
const lessons_service_1 = require("../lessons/lessons.service");
const questions_service_1 = require("../questions/questions.service");
const answers_service_1 = require("../answers/answers.service");
const classrooms_service_1 = require("../classrooms/classrooms.service");
const crypto = __importStar(require("crypto"));
let StudentsService = class StudentsService {
    constructor(studentSessionModel, lessonsService, questionsService, answersService, classroomsService) {
        this.studentSessionModel = studentSessionModel;
        this.lessonsService = lessonsService;
        this.questionsService = questionsService;
        this.answersService = answersService;
        this.classroomsService = classroomsService;
    }
    async joinLesson(joinLessonDto) {
        const accessCode = joinLessonDto.accessCode?.trim().toUpperCase();
        const studentName = joinLessonDto.studentName?.trim();
        let lesson = null;
        let classroomId;
        let className;
        const classMatch = await this.classroomsService.findByClassCode(accessCode);
        if (classMatch) {
            try {
                lesson = await this.lessonsService.findOne(classMatch.lessonId);
                classroomId = classMatch.classroom._id.toString();
                className = classMatch.classroom.name;
            }
            catch {
                lesson = await this.lessonsService.findByAccessCode(accessCode);
            }
        }
        else {
            lesson = await this.lessonsService.findByAccessCode(accessCode);
        }
        if (!lesson) {
            throw new common_1.NotFoundException(`Lesson code "${accessCode}" not found. Please verify the code with your teacher.`);
        }
        if (lesson.status !== 'Active') {
            throw new common_1.BadRequestException('This lesson is not active yet. Ask your teacher to activate it.');
        }
        const lessonId = lesson._id.toString();
        const questions = await this.questionsService.findByLesson(lessonId);
        if (questions.length === 0) {
            throw new common_1.BadRequestException('This lesson has no questions yet');
        }
        const sessionToken = this.generateSessionToken();
        const session = new this.studentSessionModel({
            lessonId: lessonId,
            studentName,
            sessionToken,
            currentQuestionIndex: 0,
            status: 'NOT_STARTED',
            classroomId,
            className,
        });
        await session.save();
        return {
            sessionToken,
            lesson: {
                id: lessonId,
                title: lesson.title,
                description: lesson.description,
                difficulty: lesson.difficulty,
                category: lesson.category,
                accessCode: lesson.accessCode,
                settings: lesson.settings,
            },
            student: {
                name: studentName,
            },
            class: classroomId ? { id: classroomId, name: className } : null,
            totalQuestions: questions.length,
        };
    }
    async findSession(sessionToken) {
        if (!sessionToken)
            return null;
        const token = sessionToken.trim();
        return this.studentSessionModel.findOne({
            $or: [
                { sessionToken: token },
                ...(token.match(/^[0-9a-fA-F]{24}$/) ? [{ _id: token }] : []),
            ],
        });
    }
    async getSession(sessionToken) {
        const session = await this.findSession(sessionToken);
        if (!session) {
            throw new common_1.NotFoundException('Session not found');
        }
        const lesson = await this.lessonsService.findOne(session.lessonId.toString());
        const questions = await this.questionsService.findByLesson(session.lessonId.toString());
        const sessionId = session._id.toString();
        const lessonId = lesson._id.toString();
        return {
            session: {
                id: sessionId,
                token: session.sessionToken,
                status: session.status,
                currentQuestionIndex: session.currentQuestionIndex,
                startedAt: session.startedAt,
                completedAt: session.completedAt,
            },
            lesson: {
                id: lessonId,
                title: lesson.title,
                description: lesson.description,
                difficulty: lesson.difficulty,
                category: lesson.category,
                settings: lesson.settings,
            },
            student: {
                name: session.studentName,
            },
            class: session.classroomId ? { id: session.classroomId, name: session.className } : null,
            totalQuestions: questions.length,
        };
    }
    async startSession(sessionToken) {
        const session = await this.findSession(sessionToken);
        if (!session) {
            throw new common_1.NotFoundException('Session not found');
        }
        if (session.status !== 'NOT_STARTED') {
            return this.getSession(sessionToken);
        }
        session.status = 'IN_PROGRESS';
        session.startedAt = new Date();
        session.currentQuestionIndex = 0;
        await session.save();
        return this.getSession(sessionToken);
    }
    async getCurrentQuestion(sessionToken) {
        const session = await this.findSession(sessionToken);
        if (!session) {
            throw new common_1.NotFoundException('Session not found');
        }
        if (session.status !== 'IN_PROGRESS') {
            throw new common_1.BadRequestException('Session is not in progress');
        }
        const questions = await this.questionsService.findByLesson(session.lessonId.toString());
        if (session.currentQuestionIndex >= questions.length) {
            throw new common_1.BadRequestException('No more questions');
        }
        const currentQuestion = questions[session.currentQuestionIndex];
        const questionId = currentQuestion._id.toString();
        return {
            question: {
                id: questionId,
                type: currentQuestion.type,
                text: currentQuestion.text,
                order: currentQuestion.order,
                options: currentQuestion.options,
                points: currentQuestion.points,
            },
            currentIndex: session.currentQuestionIndex,
            totalQuestions: questions.length,
            allowPrevious: false,
        };
    }
    async getSessionReview(sessionToken) {
        const session = await this.findSession(sessionToken);
        if (!session) {
            throw new common_1.NotFoundException('Session not found');
        }
        const sessionId = session._id.toString();
        const questions = await this.questionsService.findByLesson(session.lessonId.toString());
        const answers = await this.answersService.findBySession(sessionId);
        const answerMap = new Map(answers.map((a) => [a.questionId?.toString(), a]));
        return questions.map((q) => {
            const qid = q._id.toString();
            const a = answerMap.get(qid);
            const reviewed = a?.reviewedByTeacher === true;
            const pendingReview = q.type === 'written' && !reviewed;
            return {
                questionId: qid,
                order: q.order,
                type: q.type,
                text: q.text,
                options: q.type === 'multiple_choice' ? q.options : undefined,
                studentAnswer: a?.answer ?? null,
                isCorrect: a ? !!a.isCorrect : false,
                points: a?.points ?? 0,
                maxPoints: q.points ?? 1,
                reviewedByTeacher: reviewed,
                pendingReview,
                teacherFeedback: a?.teacherFeedback,
                correctAnswer: q.type === 'multiple_choice' ? q.correctAnswer : undefined,
                explanation: q.type === 'multiple_choice' ? (q.explanation || undefined) : undefined,
                suggestion: q.type === 'written' ? (q.correction || q.expectedAnswer || undefined) : (q.correction || undefined),
            };
        });
    }
    async completeSession(sessionToken) {
        const session = await this.findSession(sessionToken);
        if (!session) {
            throw new common_1.NotFoundException('Session not found');
        }
        if (session.status === 'COMPLETED') {
            const sessionId = session._id.toString();
            const existing = await this.answersService.calculateSessionScore(sessionId);
            return {
                session: {
                    id: sessionId,
                    status: session.status,
                    completedAt: session.completedAt,
                },
                result: existing,
            };
        }
        session.status = 'COMPLETED';
        session.completedAt = session.completedAt || new Date();
        await session.save();
        const sessionId = session._id.toString();
        const result = await this.answersService.calculateSessionScore(sessionId);
        return {
            session: {
                id: sessionId,
                status: session.status,
                completedAt: session.completedAt,
            },
            result,
        };
    }
    generateSessionToken() {
        return crypto.randomBytes(32).toString('hex');
    }
};
exports.StudentsService = StudentsService;
exports.StudentsService = StudentsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(student_session_schema_1.StudentSession.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        lessons_service_1.LessonsService,
        questions_service_1.QuestionsService,
        answers_service_1.AnswersService,
        classrooms_service_1.ClassroomsService])
], StudentsService);
//# sourceMappingURL=students.service.js.map