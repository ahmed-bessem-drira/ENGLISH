import { QuestionsService } from './questions.service';
import { CreateQuestionDto } from './dto/create-question.dto';
import { UpdateQuestionDto } from './dto/update-question.dto';
import { ReorderQuestionsDto } from './dto/reorder-questions.dto';
export declare class QuestionsController {
    private readonly questionsService;
    constructor(questionsService: QuestionsService);
    create(createQuestionDto: CreateQuestionDto, req: any): Promise<import("./schemas/question.schema").Question>;
    findByLesson(lessonId: string, req: any): Promise<import("./schemas/question.schema").Question[]>;
    reorder(lessonId: string, reorderDto: ReorderQuestionsDto, req: any): Promise<void>;
    findOne(id: string, req: any): Promise<import("./schemas/question.schema").Question>;
    update(id: string, updateQuestionDto: UpdateQuestionDto, req: any): Promise<import("./schemas/question.schema").Question>;
    remove(id: string, req: any): Promise<void>;
}
