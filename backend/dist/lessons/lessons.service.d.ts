import { Model } from 'mongoose';
import { Lesson, LessonDocument } from './schemas/lesson.schema';
import { ClassroomDocument } from '../classrooms/schemas/classroom.schema';
import { QuestionDocument } from '../questions/schemas/question.schema';
import { StudentSessionDocument } from '../students/schemas/student-session.schema';
import { AnswerDocument } from '../answers/schemas/answer.schema';
import { CreateLessonDto } from './dto/create-lesson.dto';
import { UpdateLessonDto } from './dto/update-lesson.dto';
export declare class LessonsService {
    private lessonModel;
    private classroomModel;
    private questionModel;
    private sessionModel;
    private answerModel;
    constructor(lessonModel: Model<LessonDocument>, classroomModel: Model<ClassroomDocument>, questionModel: Model<QuestionDocument>, sessionModel: Model<StudentSessionDocument>, answerModel: Model<AnswerDocument>);
    create(createLessonDto: CreateLessonDto, teacherId: string): Promise<Lesson>;
    findAll(teacherId: string): Promise<any[]>;
    findOne(id: string, teacherId?: string): Promise<Lesson>;
    findByAccessCode(accessCode: string): Promise<Lesson>;
    update(id: string, updateLessonDto: UpdateLessonDto, teacherId: string): Promise<Lesson>;
    remove(id: string, teacherId: string): Promise<void>;
    generateAccessCode(id: string, teacherId: string): Promise<{
        accessCode: string;
    }>;
    private generateUniqueAccessCode;
}
