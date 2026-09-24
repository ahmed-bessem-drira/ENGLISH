import { Document } from 'mongoose';
export type QuestionDocument = Question & Document;
export declare class Question {
    lessonId: string;
    type: string;
    text: string;
    order: number;
    options?: string[];
    correctAnswer?: string;
    expectedAnswer?: string;
    correction?: string;
    explanation?: string;
    points: number;
}
export declare const QuestionSchema: import("mongoose").Schema<Question, import("mongoose").Model<Question, any, any, any, any, any, Question>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Question, Document<unknown, {}, Question, {
    id: string;
}, import("mongoose").DefaultSchemaOptions> & Omit<Question & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}, "id"> & import("mongoose").HydratedDocumentOverrides<{
    id: string;
}>, {
    lessonId?: import("mongoose").SchemaDefinitionProperty<string, Question, Document<unknown, {}, Question, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Question & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>>;
    type?: import("mongoose").SchemaDefinitionProperty<string, Question, Document<unknown, {}, Question, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Question & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>>;
    text?: import("mongoose").SchemaDefinitionProperty<string, Question, Document<unknown, {}, Question, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Question & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>>;
    order?: import("mongoose").SchemaDefinitionProperty<number, Question, Document<unknown, {}, Question, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Question & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>>;
    options?: import("mongoose").SchemaDefinitionProperty<string[], Question, Document<unknown, {}, Question, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Question & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>>;
    correctAnswer?: import("mongoose").SchemaDefinitionProperty<string, Question, Document<unknown, {}, Question, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Question & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>>;
    expectedAnswer?: import("mongoose").SchemaDefinitionProperty<string, Question, Document<unknown, {}, Question, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Question & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>>;
    correction?: import("mongoose").SchemaDefinitionProperty<string, Question, Document<unknown, {}, Question, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Question & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>>;
    explanation?: import("mongoose").SchemaDefinitionProperty<string, Question, Document<unknown, {}, Question, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Question & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>>;
    points?: import("mongoose").SchemaDefinitionProperty<number, Question, Document<unknown, {}, Question, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Question & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>>;
}, Question>;
