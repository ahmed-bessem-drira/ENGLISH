import { Document } from 'mongoose';
export type StudentSessionDocument = StudentSession & Document;
export declare class StudentSession {
    lessonId: string;
    studentName: string;
    classroomId?: string;
    className?: string;
    sessionToken: string;
    currentQuestionIndex: number;
    status: string;
    startedAt?: Date;
    completedAt?: Date;
}
export declare const StudentSessionSchema: import("mongoose").Schema<StudentSession, import("mongoose").Model<StudentSession, any, any, any, any, any, StudentSession>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, StudentSession, Document<unknown, {}, StudentSession, {
    id: string;
}, import("mongoose").DefaultSchemaOptions> & Omit<StudentSession & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}, "id"> & import("mongoose").HydratedDocumentOverrides<{
    id: string;
}>, {
    lessonId?: import("mongoose").SchemaDefinitionProperty<string, StudentSession, Document<unknown, {}, StudentSession, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<StudentSession & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>>;
    studentName?: import("mongoose").SchemaDefinitionProperty<string, StudentSession, Document<unknown, {}, StudentSession, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<StudentSession & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>>;
    classroomId?: import("mongoose").SchemaDefinitionProperty<string, StudentSession, Document<unknown, {}, StudentSession, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<StudentSession & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>>;
    className?: import("mongoose").SchemaDefinitionProperty<string, StudentSession, Document<unknown, {}, StudentSession, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<StudentSession & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>>;
    sessionToken?: import("mongoose").SchemaDefinitionProperty<string, StudentSession, Document<unknown, {}, StudentSession, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<StudentSession & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>>;
    currentQuestionIndex?: import("mongoose").SchemaDefinitionProperty<number, StudentSession, Document<unknown, {}, StudentSession, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<StudentSession & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>>;
    status?: import("mongoose").SchemaDefinitionProperty<string, StudentSession, Document<unknown, {}, StudentSession, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<StudentSession & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>>;
    startedAt?: import("mongoose").SchemaDefinitionProperty<Date, StudentSession, Document<unknown, {}, StudentSession, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<StudentSession & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>>;
    completedAt?: import("mongoose").SchemaDefinitionProperty<Date, StudentSession, Document<unknown, {}, StudentSession, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<StudentSession & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>>;
}, StudentSession>;
