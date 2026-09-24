import { Document } from 'mongoose';
export type AnswerDocument = Answer & Document;
export declare class Answer {
    sessionId: string;
    lessonId: string;
    questionId: string;
    answer: string;
    isCorrect: boolean;
    points: number;
    teacherFeedback?: string;
    reviewedByTeacher: boolean;
    submittedAt?: Date;
}
export declare const AnswerSchema: import("mongoose").Schema<Answer, import("mongoose").Model<Answer, any, any, any, any, any, Answer>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Answer, Document<unknown, {}, Answer, {
    id: string;
}, import("mongoose").DefaultSchemaOptions> & Omit<Answer & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}, "id"> & import("mongoose").HydratedDocumentOverrides<{
    id: string;
}>, {
    sessionId?: import("mongoose").SchemaDefinitionProperty<string, Answer, Document<unknown, {}, Answer, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Answer & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>>;
    lessonId?: import("mongoose").SchemaDefinitionProperty<string, Answer, Document<unknown, {}, Answer, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Answer & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>>;
    questionId?: import("mongoose").SchemaDefinitionProperty<string, Answer, Document<unknown, {}, Answer, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Answer & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>>;
    answer?: import("mongoose").SchemaDefinitionProperty<string, Answer, Document<unknown, {}, Answer, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Answer & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>>;
    isCorrect?: import("mongoose").SchemaDefinitionProperty<boolean, Answer, Document<unknown, {}, Answer, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Answer & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>>;
    points?: import("mongoose").SchemaDefinitionProperty<number, Answer, Document<unknown, {}, Answer, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Answer & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>>;
    teacherFeedback?: import("mongoose").SchemaDefinitionProperty<string, Answer, Document<unknown, {}, Answer, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Answer & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>>;
    reviewedByTeacher?: import("mongoose").SchemaDefinitionProperty<boolean, Answer, Document<unknown, {}, Answer, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Answer & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>>;
    submittedAt?: import("mongoose").SchemaDefinitionProperty<Date, Answer, Document<unknown, {}, Answer, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Answer & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>>;
}, Answer>;
