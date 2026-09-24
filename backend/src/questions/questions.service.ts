import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Question, QuestionDocument } from './schemas/question.schema';
import { CreateQuestionDto } from './dto/create-question.dto';
import { UpdateQuestionDto } from './dto/update-question.dto';
import { ReorderQuestionsDto } from './dto/reorder-questions.dto';
import { LessonsService } from '../lessons/lessons.service';

@Injectable()
export class QuestionsService {
  constructor(
    @InjectModel(Question.name) private questionModel: Model<QuestionDocument>,
    private lessonsService: LessonsService,
  ) {}

  async create(createQuestionDto: CreateQuestionDto, teacherId: string): Promise<Question> {
    await this.lessonsService.findOne(createQuestionDto.lessonId, teacherId);

    const lastQuestion = await this.questionModel
      .findOne({ lessonId: createQuestionDto.lessonId })
      .sort({ order: -1 });

    const order = lastQuestion ? lastQuestion.order + 1 : 0;

    const question = new this.questionModel({
      ...createQuestionDto,
      order,
    });

    return question.save();
  }

  async findByLesson(lessonId: string, teacherId?: string): Promise<Question[]> {
    if (teacherId) {
      await this.lessonsService.findOne(lessonId, teacherId);
    }

    return this.questionModel.find({ lessonId }).sort({ order: 1 });
  }

  async findOne(id: string, teacherId?: string): Promise<Question> {
    const question = await this.questionModel.findById(id);
    if (!question) {
      throw new NotFoundException('Question not found');
    }

    if (teacherId) {
      await this.lessonsService.findOne(question.lessonId, teacherId);
    }

    return question;
  }

  async update(id: string, updateQuestionDto: UpdateQuestionDto, teacherId: string): Promise<Question> {
    await this.findOne(id, teacherId);
    const { lessonId, ...safeUpdate } = updateQuestionDto as any;
    return this.questionModel.findByIdAndUpdate(id, safeUpdate, { new: true });
  }

  async remove(id: string, teacherId: string): Promise<void> {
    const question = await this.findOne(id, teacherId);
    await this.questionModel.findByIdAndDelete(id);
  }

  async reorder(lessonId: string, reorderDto: ReorderQuestionsDto, teacherId: string): Promise<void> {
    await this.lessonsService.findOne(lessonId, teacherId);

    for (const { questionId, order } of reorderDto.questions) {
      await this.questionModel.updateOne(
        { _id: questionId, lessonId },
        { order }
      );
    }
  }

  async findByQuestionIds(questionIds: string[]): Promise<Question[]> {
    return this.questionModel.find({ _id: { $in: questionIds } });
  }
}