import { Model } from 'mongoose';
import { StudentSessionDocument } from '../students/schemas/student-session.schema';
import { Answer, AnswerDocument } from '../answers/schemas/answer.schema';
import { QuestionDocument } from '../questions/schemas/question.schema';
import { LessonDocument } from '../lessons/schemas/lesson.schema';
import { ClassroomDocument } from '../classrooms/schemas/classroom.schema';
import { AnswersService } from '../answers/answers.service';
export declare class ResultsService {
    private studentSessionModel;
    private answerModel;
    private questionModel;
    private lessonModel;
    private classroomModel;
    private answersService;
    constructor(studentSessionModel: Model<StudentSessionDocument>, answerModel: Model<AnswerDocument>, questionModel: Model<QuestionDocument>, lessonModel: Model<LessonDocument>, classroomModel: Model<ClassroomDocument>, answersService: AnswersService);
    getLessonResults(lessonId: string, teacherId: string, classroomId?: string): Promise<{
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
    getSessionDetails(sessionId: string, teacherId: string, lessonId?: string): Promise<{
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
    reviewAnswer(answerId: string, teacherId: string, reviewData: {
        isCorrect: boolean;
        points: number;
        teacherFeedback?: string;
    }, lessonId?: string): Promise<import("mongoose").Document<unknown, {}, AnswerDocument, {}, import("mongoose").DefaultSchemaOptions> & Answer & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    }>;
    deleteLessonResults(lessonId: string, teacherId: string): Promise<{
        deletedSessions: number;
        deletedAnswers: number;
    }>;
}
