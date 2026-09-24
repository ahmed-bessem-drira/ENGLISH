import { Model } from 'mongoose';
import { Teacher, TeacherDocument } from './schemas/teacher.schema';
import { CreateTeacherDto } from './dto/create-teacher.dto';
export declare class TeachersService {
    private teacherModel;
    constructor(teacherModel: Model<TeacherDocument>);
    create(createTeacherDto: CreateTeacherDto): Promise<Teacher>;
    findByEmail(email: string): Promise<Teacher | null>;
    findById(id: string): Promise<Teacher>;
    validatePassword(plainPassword: string, hashedPassword: string): Promise<boolean>;
}
