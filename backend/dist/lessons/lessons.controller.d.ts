import { LessonsService } from './lessons.service';
import { CreateLessonDto } from './dto/create-lesson.dto';
import { UpdateLessonDto } from './dto/update-lesson.dto';
export declare class LessonsController {
    private readonly lessonsService;
    constructor(lessonsService: LessonsService);
    create(createLessonDto: CreateLessonDto, req: any): Promise<import("./schemas/lesson.schema").Lesson>;
    findAll(req: any): Promise<any[]>;
    findOne(id: string, req: any): Promise<import("./schemas/lesson.schema").Lesson>;
    update(id: string, updateLessonDto: UpdateLessonDto, req: any): Promise<import("./schemas/lesson.schema").Lesson>;
    remove(id: string, req: any): Promise<void>;
    generateCode(id: string, req: any): Promise<{
        accessCode: string;
    }>;
}
