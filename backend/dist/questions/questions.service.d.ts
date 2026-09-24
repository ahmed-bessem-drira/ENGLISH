import { Model } from 'mongoose';
import { Question, QuestionDocument } from './schemas/question.schema';
import { CreateQuestionDto } from './dto/create-question.dto';
import { UpdateQuestionDto } from './dto/update-question.dto';
import { ReorderQuestionsDto } from './dto/reorder-questions.dto';
import { LessonsService } from '../lessons/lessons.service';
export declare class QuestionsService {
    private questionModel;
    private lessonsService;
    constructor(questionModel: Model<QuestionDocument>, lessonsService: LessonsService);
    create(createQuestionDto: CreateQuestionDto, teacherId: string): Promise<Question>;
    findByLesson(lessonId: string, teacherId?: string): Promise<Question[]>;
    findOne(id: string, teacherId?: string): Promise<Question>;
    update(id: string, updateQuestionDto: UpdateQuestionDto, teacherId: string): Promise<Question>;
    remove(id: string, teacherId: string): Promise<void>;
    reorder(lessonId: string, reorderDto: ReorderQuestionsDto, teacherId: string): Promise<void>;
    findByQuestionIds(questionIds: string[]): Promise<Question[]>;
}
