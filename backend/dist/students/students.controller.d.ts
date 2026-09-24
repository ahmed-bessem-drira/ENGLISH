import { StudentsService } from './students.service';
import { JoinLessonDto } from './dto/join-lesson.dto';
export declare class StudentsController {
    private readonly studentsService;
    constructor(studentsService: StudentsService);
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
    getSession(token: string): Promise<{
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
    startSession(token: string): Promise<{
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
    getCurrentQuestion(token: string): Promise<{
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
    getSessionReview(token: string): Promise<{
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
    completeSession(token: string): Promise<{
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
}
