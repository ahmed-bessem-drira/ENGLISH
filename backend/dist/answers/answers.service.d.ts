import { Model } from 'mongoose';
import { Answer, AnswerDocument } from './schemas/answer.schema';
import { SubmitAnswerDto } from './dto/submit-answer.dto';
import { QuestionsService } from '../questions/questions.service';
import { StudentSessionDocument } from '../students/schemas/student-session.schema';
export declare class AnswersService {
    private answerModel;
    private studentSessionModel;
    private questionsService;
    constructor(answerModel: Model<AnswerDocument>, studentSessionModel: Model<StudentSessionDocument>, questionsService: QuestionsService);
    private findSession;
    submitAnswer(sessionToken: string, submitAnswerDto: SubmitAnswerDto): Promise<{
        answer: {
            id: string;
            isCorrect: boolean;
            points: number;
            pendingReview: boolean;
            correctAnswer: string;
            explanation: string;
            suggestion: string;
        };
        nextQuestionIndex: number;
        hasNextQuestion: boolean;
    }>;
    findBySession(sessionId: string): Promise<(import("mongoose").Document<unknown, {}, AnswerDocument, {}, import("mongoose").DefaultSchemaOptions> & Answer & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    })[]>;
    calculateSessionScore(sessionId: string): Promise<{
        totalQuestions: number;
        correctCount: number;
        incorrectCount: number;
        pendingCount: number;
        totalPoints: number;
        earnedPoints: number;
        percentage: number;
    }>;
    findById(id: string): Promise<import("mongoose").Document<unknown, {}, AnswerDocument, {}, import("mongoose").DefaultSchemaOptions> & Answer & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    }>;
    updateAnswer(id: string, updateData: {
        isCorrect?: boolean;
        points?: number;
        teacherFeedback?: string;
        reviewedByTeacher?: boolean;
    }): Promise<import("mongoose").Document<unknown, {}, AnswerDocument, {}, import("mongoose").DefaultSchemaOptions> & Answer & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    }>;
}
