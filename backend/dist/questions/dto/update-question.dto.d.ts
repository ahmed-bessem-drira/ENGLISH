import { CreateQuestionDto } from './create-question.dto';
declare const UpdateQuestionDto_base: import("@nestjs/mapped-types").MappedType<Partial<Omit<CreateQuestionDto, "lessonId">>>;
export declare class UpdateQuestionDto extends UpdateQuestionDto_base {
}
export {};
