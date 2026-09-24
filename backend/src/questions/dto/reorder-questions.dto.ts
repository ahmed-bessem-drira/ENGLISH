import { IsArray, IsNotEmpty, IsString, IsNumber, Min, ArrayNotEmpty, ValidateNested, IsMongoId } from 'class-validator';
import { Type } from 'class-transformer';

export class ReorderQuestionDto {
  @IsMongoId()
  questionId: string;

  @IsNumber()
  @Min(0)
  @Type(() => Number)
  order: number;
}

export class ReorderQuestionsDto {
  @IsArray()
  @ArrayNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => ReorderQuestionDto)
  questions: ReorderQuestionDto[];
}