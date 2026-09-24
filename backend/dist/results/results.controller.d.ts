import { ResultsService } from './results.service';
import { ReviewAnswerDto } from './dto/review-answer.dto';
export declare class ResultsController {
    private readonly resultsService;
    constructor(resultsService: ResultsService);
    getLessonResults(lessonId: string, req: any, classroomId?: string): Promise<{
        lesson: {
            id: string;
            title: string;
            accessCode: string;
        };
        classroom: {
            id: string;
            name: string;
        };
        statistics: {
            totalParticipants: number;
            completedCount: number;
            averageScore: number;
        };
        results: {
            sessionId: string;
            studentName: string;
            status: string;
            className: string;
            score: number;
            totalPoints: number;
            percentage: number;
            pendingCount: number;
            startedAt: Date;
            completedAt: Date;
        }[];
    }>;
    getSessionDetails(lessonId: string, sessionId: string, req: any): Promise<{
        session: {
            id: string;
            studentName: string;
            status: string;
            className: string;
            startedAt: Date;
            completedAt: Date;
        };
        score: {
            totalQuestions: number;
            correctCount: number;
            incorrectCount: number;
            pendingCount: number;
            totalPoints: number;
            earnedPoints: number;
            percentage: number;
        };
        answers: {
            id: string;
            questionId: string;
            questionText: string;
            questionType: string;
            studentAnswer: string;
            correctAnswer: string;
            isCorrect: boolean;
            points: number;
            maxPoints: number;
            teacherFeedback: string;
            reviewedByTeacher: boolean;
            submittedAt: Date;
        }[];
    }>;
    reviewAnswer(lessonId: string, answerId: string, reviewData: ReviewAnswerDto, req: any): Promise<import("mongoose").Document<unknown, {}, import("../answers/schemas/answer.schema").AnswerDocument, {}, import("mongoose").DefaultSchemaOptions> & import("../answers/schemas/answer.schema").Answer & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    }>;
    deleteLessonResults(lessonId: string, req: any): Promise<{
        deletedSessions: number;
        deletedAnswers: number;
    }>;
}
