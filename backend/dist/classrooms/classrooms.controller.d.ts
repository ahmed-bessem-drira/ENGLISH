import { ClassroomsService } from './classrooms.service';
import { CreateClassroomDto } from './dto/create-classroom.dto';
import { UpdateClassroomDto } from './dto/update-classroom.dto';
import { AttachLessonDto } from './dto/attach-lesson.dto';
export declare class ClassroomsController {
    private readonly classroomsService;
    constructor(classroomsService: ClassroomsService);
    create(createClassroomDto: CreateClassroomDto, req: any): Promise<import("mongoose").Document<unknown, {}, import("./schemas/classroom.schema").ClassroomDocument, {}, import("mongoose").DefaultSchemaOptions> & import("./schemas/classroom.schema").Classroom & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    }>;
    findAll(req: any): Promise<any[]>;
    findOne(id: string, req: any): Promise<{
        _id: any;
        name: any;
        description: any;
        lessonIds: any;
        lessons: any[];
        createdAt: any;
        updatedAt: any;
    }>;
    update(id: string, updateClassroomDto: UpdateClassroomDto, req: any): Promise<import("mongoose").Document<unknown, {}, import("./schemas/classroom.schema").ClassroomDocument, {}, import("mongoose").DefaultSchemaOptions> & import("./schemas/classroom.schema").Classroom & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    }>;
    remove(id: string, req: any): Promise<void>;
    attachLesson(id: string, attachLessonDto: AttachLessonDto, req: any): Promise<{
        lessonId: string;
        classCode: string;
    }>;
    detachLesson(id: string, lessonId: string, req: any): Promise<{
        detached: boolean;
    }>;
    regenerateLessonCode(id: string, lessonId: string, req: any): Promise<{
        lessonId: string;
        classCode: string;
    }>;
}
