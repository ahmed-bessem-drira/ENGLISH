import { Document } from 'mongoose';
export type LessonDocument = Lesson & Document;
export interface LessonSettings {
    showCorrectionImmediately: boolean;
    showFinalScore: boolean;
    showCorrectAnswersAtEnd: boolean;
    allowRetry: boolean;
    allowPreviousQuestion: boolean;
    shuffleQuestions: boolean;
    shuffleOptions: boolean;
}
export declare class Lesson {
    teacherId: string;
    title: string;
    description: string;
    category: string;
    difficulty: string;
    status: string;
    accessCode: string;
    settings: LessonSettings;
}
export declare const LessonSchema: import("mongoose").Schema<Lesson, import("mongoose").Model<Lesson, any, any, any, any, any, Lesson>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Lesson, Document<unknown, {}, Lesson, {
    id: string;
}, import("mongoose").DefaultSchemaOptions> & Omit<Lesson & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}, "id"> & import("mongoose").HydratedDocumentOverrides<{
    id: string;
}>, {
    teacherId?: import("mongoose").SchemaDefinitionProperty<string, Lesson, Document<unknown, {}, Lesson, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Lesson & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>>;
    title?: import("mongoose").SchemaDefinitionProperty<string, Lesson, Document<unknown, {}, Lesson, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Lesson & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>>;
    description?: import("mongoose").SchemaDefinitionProperty<string, Lesson, Document<unknown, {}, Lesson, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Lesson & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>>;
    category?: import("mongoose").SchemaDefinitionProperty<string, Lesson, Document<unknown, {}, Lesson, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Lesson & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>>;
    difficulty?: import("mongoose").SchemaDefinitionProperty<string, Lesson, Document<unknown, {}, Lesson, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Lesson & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>>;
    status?: import("mongoose").SchemaDefinitionProperty<string, Lesson, Document<unknown, {}, Lesson, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Lesson & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>>;
    accessCode?: import("mongoose").SchemaDefinitionProperty<string, Lesson, Document<unknown, {}, Lesson, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Lesson & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>>;
    settings?: import("mongoose").SchemaDefinitionProperty<LessonSettings, Lesson, Document<unknown, {}, Lesson, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Lesson & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>>;
}, Lesson>;
