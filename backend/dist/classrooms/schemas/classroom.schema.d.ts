import { Document } from 'mongoose';
export type ClassroomDocument = Classroom & Document;
export declare class Classroom {
    teacherId: string;
    name: string;
    description: string;
    lessonIds: string[];
    lessonCodes: {
        lessonId: string;
        accessCode: string;
    }[];
}
export declare const ClassroomSchema: import("mongoose").Schema<Classroom, import("mongoose").Model<Classroom, any, any, any, any, any, Classroom>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Classroom, Document<unknown, {}, Classroom, {
    id: string;
}, import("mongoose").DefaultSchemaOptions> & Omit<Classroom & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}, "id"> & import("mongoose").HydratedDocumentOverrides<{
    id: string;
}>, {
    teacherId?: import("mongoose").SchemaDefinitionProperty<string, Classroom, Document<unknown, {}, Classroom, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Classroom & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>>;
    name?: import("mongoose").SchemaDefinitionProperty<string, Classroom, Document<unknown, {}, Classroom, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Classroom & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>>;
    description?: import("mongoose").SchemaDefinitionProperty<string, Classroom, Document<unknown, {}, Classroom, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Classroom & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>>;
    lessonIds?: import("mongoose").SchemaDefinitionProperty<string[], Classroom, Document<unknown, {}, Classroom, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Classroom & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>>;
    lessonCodes?: import("mongoose").SchemaDefinitionProperty<{
        lessonId: string;
        accessCode: string;
    }[], Classroom, Document<unknown, {}, Classroom, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Classroom & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>>;
}, Classroom>;
