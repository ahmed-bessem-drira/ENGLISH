import { Model } from 'mongoose';
import { Classroom, ClassroomDocument } from './schemas/classroom.schema';
import { CreateClassroomDto } from './dto/create-classroom.dto';
import { UpdateClassroomDto } from './dto/update-classroom.dto';
import { LessonsService } from '../lessons/lessons.service';
import { LessonDocument } from '../lessons/schemas/lesson.schema';
export declare class ClassroomsService {
    private classroomModel;
    private lessonModel;
    private lessonsService;
    constructor(classroomModel: Model<ClassroomDocument>, lessonModel: Model<LessonDocument>, lessonsService: LessonsService);
    create(createClassroomDto: CreateClassroomDto, teacherId: string): Promise<import("mongoose").Document<unknown, {}, ClassroomDocument, {}, import("mongoose").DefaultSchemaOptions> & Classroom & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    }>;
    findAll(teacherId: string): Promise<any[]>;
    findOne(id: string, teacherId: string): Promise<{
        _id: any;
        name: any;
        description: any;
        lessonIds: any;
        lessons: any[];
        createdAt: any;
        updatedAt: any;
    }>;
    update(id: string, updateClassroomDto: UpdateClassroomDto, teacherId: string): Promise<import("mongoose").Document<unknown, {}, ClassroomDocument, {}, import("mongoose").DefaultSchemaOptions> & Classroom & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    }>;
    remove(id: string, teacherId: string): Promise<void>;
    attachLesson(id: string, lessonId: string, teacherId: string): Promise<{
        lessonId: string;
        classCode: string;
    }>;
    detachLesson(id: string, lessonId: string, teacherId: string): Promise<{
        detached: boolean;
    }>;
    regenerateLessonCode(id: string, lessonId: string, teacherId: string): Promise<{
        lessonId: string;
        classCode: string;
    }>;
    findByClassCode(accessCode: string): Promise<{
        classroom: any;
        lessonId: any;
    }>;
    private codesMap;
    private ensureCodes;
    private generateUniqueClassCode;
}
