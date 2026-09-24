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
exports.AnswersService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const answer_schema_1 = require("./schemas/answer.schema");
const questions_service_1 = require("../questions/questions.service");
const student_session_schema_1 = require("../students/schemas/student-session.schema");
let AnswersService = class AnswersService {
    constructor(answerModel, studentSessionModel, questionsService) {
        this.answerModel = answerModel;
        this.studentSessionModel = studentSessionModel;
        this.questionsService = questionsService;
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
    async submitAnswer(sessionToken, submitAnswerDto) {
        const session = await this.findSession(sessionToken);
        if (!session) {
            throw new common_1.NotFoundException('Session not found');
        }
        if (session.status !== 'IN_PROGRESS') {
            session.status = 'IN_PROGRESS';
            await session.save();
        }
        const question = await this.questionsService.findOne(submitAnswerDto.questionId);
        if (question.lessonId.toString() !== session.lessonId.toString()) {
            throw new common_1.BadRequestException('Question does not belong to this lesson');
        }
        const existingAnswer = await this.answerModel.findOne({
            sessionId: session._id.toString(),
            questionId: submitAnswerDto.questionId,
        });
        if (existingAnswer) {
            throw new common_1.BadRequestException('This question has already been answered');
        }
        let isCorrect = false;
        let points = 0;
        let pendingReview = false;
        if (question.type === 'multiple_choice') {
            isCorrect = submitAnswerDto.answer === question.correctAnswer;
            points = isCorrect ? question.points : 0;
        }
        else {
            isCorrect = false;
            points = 0;
            pendingReview = true;
        }
        const answer = new this.answerModel({
            sessionId: session._id.toString(),
            lessonId: session.lessonId.toString(),
            questionId: submitAnswerDto.questionId,
            answer: submitAnswerDto.answer,
            isCorrect,
            points,
            submittedAt: new Date(),
        });
        await answer.save();
        const allQuestions = await this.questionsService.findByLesson(session.lessonId.toString());
        const nextQuestionIndex = session.currentQuestionIndex + 1;
        if (nextQuestionIndex < allQuestions.length) {
            session.currentQuestionIndex = nextQuestionIndex;
            await session.save();
        }
        return {
            answer: {
                id: answer._id.toString(),
                isCorrect,
                points,
                pendingReview,
                correctAnswer: question.type === 'multiple_choice' ? question.correctAnswer : undefined,
                explanation: question.type === 'multiple_choice' ? question.explanation : undefined,
                suggestion: question.type === 'written' ? (question.correction || question.expectedAnswer || undefined) : (question.correction || undefined),
            },
            nextQuestionIndex: session.currentQuestionIndex,
            hasNextQuestion: nextQuestionIndex < allQuestions.length,
        };
    }
    async findBySession(sessionId) {
        return this.answerModel.find({ sessionId }).sort({ submittedAt: 1 });
    }
    async calculateSessionScore(sessionId) {
        const session = await this.studentSessionModel.findById(sessionId);
        const answers = await this.findBySession(sessionId);
        const questionPoints = new Map();
        const questionTypes = new Map();
        let totalQuestions = answers.length;
        if (session) {
            try {
                const questions = await this.questionsService.findByLesson(session.lessonId.toString());
                totalQuestions = questions.length;
                questions.forEach((q) => {
                    questionPoints.set(q._id.toString(), q.points ?? 1);
                    questionTypes.set(q._id.toString(), q.type);
                });
            }
            catch {
            }
        }
        let totalPoints = 0;
        let earnedPoints = 0;
        let correctCount = 0;
        let incorrectCount = 0;
        let pendingCount = 0;
        questionPoints.forEach((pts) => {
            totalPoints += pts || 0;
        });
        const answeredIds = new Set(answers.map((a) => a.questionId?.toString()));
        questionTypes.forEach((type, qid) => {
            if (!answeredIds.has(qid) && type === 'written') {
                pendingCount++;
            }
        });
        answers.forEach((answer) => {
            earnedPoints += answer.points || 0;
            const isWrittenPending = questionTypes.get(answer.questionId?.toString()) === 'written' && answer.reviewedByTeacher !== true;
            if (answer.isCorrect) {
                correctCount++;
            }
            else if (isWrittenPending) {
                pendingCount++;
            }
            else {
                incorrectCount++;
            }
        });
        if (totalPoints === 0 && answers.length > 0) {
            totalPoints = earnedPoints;
        }
        const percentage = totalPoints > 0 ? Math.round((earnedPoints / totalPoints) * 100) : 0;
        return {
            totalQuestions,
            correctCount,
            incorrectCount,
            pendingCount,
            totalPoints,
            earnedPoints,
            percentage,
        };
    }
    async findById(id) {
        const answer = await this.answerModel.findById(id);
        if (!answer) {
            throw new common_1.NotFoundException('Answer not found');
        }
        return answer;
    }
    async updateAnswer(id, updateData) {
        const answer = await this.findById(id);
        Object.assign(answer, updateData);
        return answer.save();
    }
};
exports.AnswersService = AnswersService;
exports.AnswersService = AnswersService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(answer_schema_1.Answer.name)),
    __param(1, (0, mongoose_1.InjectModel)(student_session_schema_1.StudentSession.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        mongoose_2.Model,
        questions_service_1.QuestionsService])
], AnswersService);
//# sourceMappingURL=answers.service.js.map