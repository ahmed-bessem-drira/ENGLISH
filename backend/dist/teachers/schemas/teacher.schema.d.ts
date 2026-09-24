import { Document } from 'mongoose';
export type TeacherDocument = Teacher & Document;
export declare class Teacher {
    name: string;
    email: string;
    passwordHash: string;
    avatar?: string;
    role: string;
}
export declare const TeacherSchema: import("mongoose").Schema<Teacher, import("mongoose").Model<Teacher, any, any, any, any, any, Teacher>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Teacher, Document<unknown, {}, Teacher, {
    id: string;
}, import("mongoose").DefaultSchemaOptions> & Omit<Teacher & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}, "id"> & import("mongoose").HydratedDocumentOverrides<{
    id: string;
}>, {
    name?: import("mongoose").SchemaDefinitionProperty<string, Teacher, Document<unknown, {}, Teacher, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Teacher & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>>;
    email?: import("mongoose").SchemaDefinitionProperty<string, Teacher, Document<unknown, {}, Teacher, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Teacher & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>>;
    passwordHash?: import("mongoose").SchemaDefinitionProperty<string, Teacher, Document<unknown, {}, Teacher, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Teacher & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>>;
    avatar?: import("mongoose").SchemaDefinitionProperty<string, Teacher, Document<unknown, {}, Teacher, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Teacher & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>>;
    role?: import("mongoose").SchemaDefinitionProperty<string, Teacher, Document<unknown, {}, Teacher, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Teacher & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>>;
}, Teacher>;
