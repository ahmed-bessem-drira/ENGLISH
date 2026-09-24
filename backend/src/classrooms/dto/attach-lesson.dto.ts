import { IsMongoId } from 'class-validator';

export class AttachLessonDto {
  @IsMongoId()
  lessonId: string;
}
