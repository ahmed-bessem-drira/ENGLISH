import { AnswersService } from './answers.service';
import { SubmitAnswerDto } from './dto/submit-answer.dto';
export declare class AnswersController {
    private readonly answersService;
    constructor(answersService: AnswersService);
    submitAnswer(token: string, submitAnswerDto: SubmitAnswerDto): Promise<{
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
}
