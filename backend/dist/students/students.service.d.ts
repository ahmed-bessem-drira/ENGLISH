import { Model } from 'mongoose';
import { StudentSessionDocument } from './schemas/student-session.schema';
import { JoinLessonDto } from './dto/join-lesson.dto';
import { LessonsService } from '../lessons/lessons.service';
import { QuestionsService } from '../questions/questions.service';
import { AnswersService } from '../answers/answers.service';
import { ClassroomsService } from '../classrooms/classrooms.service';
export declare class StudentsService {
    private studentSessionModel;
    private lessonsService;
    private questionsService;
    private answersService;
    private classroomsService;
    constructor(studentSessionModel: Model<StudentSessionDocument>, lessonsService: LessonsService, questionsService: QuestionsService, answersService: AnswersService, classroomsService: ClassroomsService);
    joinLesson(joinLessonDto: JoinLessonDto): Promise<{
        sessionToken: string;
        lesson: {
            id: any;
            title: any;
            description: any;
            difficulty: any;
            category: any;
            accessCode: any;
            settings: any;
        };
        student: {
            name: string;
        };
        class: {
            id: string;
            name: string;
        };
        totalQuestions: number;
    }>;
    private findSession;
    getSession(sessionToken: string): Promise<{
        session: {
            id: any;
            token: string;
            status: string;
            currentQuestionIndex: number;
            startedAt: Date;
            completedAt: Date;
        };
        lesson: {
            id: any;
            title: string;
            description: string;
            difficulty: string;
            category: string;
            settings: import("../lessons/schemas/lesson.schema").LessonSettings;
        };
        student: {
            name: string;
        };
        class: {
            id: string;
            name: string;
        };
        totalQuestions: number;
    }>;
    startSession(sessionToken: string): Promise<{
        session: {
            id: any;
            token: string;
            status: string;
            currentQuestionIndex: number;
            startedAt: Date;
            completedAt: Date;
        };
        lesson: {
            id: any;
            title: string;
            description: string;
            difficulty: string;
            category: string;
            settings: import("../lessons/schemas/lesson.schema").LessonSettings;
        };
        student: {
            name: string;
        };
        class: {
            id: string;
            name: string;
        };
        totalQuestions: number;
    }>;
    getCurrentQuestion(sessionToken: string): Promise<{
        question: {
            id: any;
            type: string;
            text: string;
            order: number;
            options: string[];
            points: number;
        };
        currentIndex: number;
        totalQuestions: number;
        allowPrevious: boolean;
    }>;
    getSessionReview(sessionToken: string): Promise<{
        questionId: any;
        order: any;
        type: any;
        text: any;
        options: any;
        studentAnswer: any;
        isCorrect: boolean;
        points: any;
        maxPoints: any;
        reviewedByTeacher: boolean;
        pendingReview: boolean;
        teacherFeedback: any;
        correctAnswer: any;
        explanation: any;
        suggestion: any;
    }[]>;
    completeSession(sessionToken: string): Promise<{
        session: {
            id: any;
            status: string;
            completedAt: Date;
        };
        result: {
            totalQuestions: number;
            correctCount: number;
            incorrectCount: number;
            pendingCount: number;
            totalPoints: number;
            earnedPoints: number;
            percentage: number;
        };
    }>;
    private generateSessionToken;
}
