export declare class CreateQuestionDto {
    lessonId: string;
    type: string;
    text: string;
    options?: string[];
    correctAnswer?: string;
    expectedAnswer?: string;
    correction?: string;
    explanation?: string;
    points?: number;
}
