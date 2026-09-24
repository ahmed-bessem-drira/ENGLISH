import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Answer, AnswerDocument } from './schemas/answer.schema';
import { SubmitAnswerDto } from './dto/submit-answer.dto';
import { QuestionsService } from '../questions/questions.service';
import { StudentSession, StudentSessionDocument } from '../students/schemas/student-session.schema';

@Injectable()
export class AnswersService {
  constructor(
    @InjectModel(Answer.name) private answerModel: Model<AnswerDocument>,
    @InjectModel(StudentSession.name) private studentSessionModel: Model<StudentSessionDocument>,
    private questionsService: QuestionsService,
  ) {}

  private async findSession(sessionToken: string): Promise<StudentSessionDocument | null> {
    if (!sessionToken) return null;
    const token = sessionToken.trim();
    return this.studentSessionModel.findOne({
      $or: [
        { sessionToken: token },
        ...(token.match(/^[0-9a-fA-F]{24}$/) ? [{ _id: token }] : []),
      ],
    });
  }

  async submitAnswer(sessionToken: string, submitAnswerDto: SubmitAnswerDto) {
    const session = await this.findSession(sessionToken);
    if (!session) {
      throw new NotFoundException('Session not found');
    }

    if (session.status !== 'IN_PROGRESS') {
      session.status = 'IN_PROGRESS';
      await session.save();
    }

    const question = await this.questionsService.findOne(submitAnswerDto.questionId);
    if (question.lessonId.toString() !== session.lessonId.toString()) {
      throw new BadRequestException('Question does not belong to this lesson');
    }

    const existingAnswer = await this.answerModel.findOne({
      sessionId: session._id.toString(),
      questionId: submitAnswerDto.questionId,
    });

    if (existingAnswer) {
      throw new BadRequestException('This question has already been answered');
    }

    let isCorrect = false;
    let points = 0;
    let pendingReview = false;

    if (question.type === 'multiple_choice') {
      isCorrect = submitAnswerDto.answer === question.correctAnswer;
      points = isCorrect ? question.points : 0;
    } else {
      // Ecrit : pas d'evaluation automatique (copie conforme impossible).
      // La note est attribuee par le prof lors de la review.
      isCorrect = false;
      points = 0;
      pendingReview = true;
    }

    const answer = new this.answerModel({
      sessionId: session._id.toString(),
      lessonId: session.lessonId.toString(),
      questionId: submitAnswerDto.questionId,
      answer: submitAnswerDto.answer,
      isCorrect,
      points,
      submittedAt: new Date(),
    });

    await answer.save();

    const allQuestions = await this.questionsService.findByLesson(session.lessonId.toString());
    const nextQuestionIndex = session.currentQuestionIndex + 1;

    if (nextQuestionIndex < allQuestions.length) {
      session.currentQuestionIndex = nextQuestionIndex;
      await session.save();
    }

    return {
      answer: {
        id: answer._id.toString(),
        isCorrect,
        points,
        pendingReview,
        // QCM : on montre la bonne reponse + explications juste apres la reponse.
        // Ecrit : suggestion du prof (correction) si elle existe, sans verdict.
        correctAnswer: question.type === 'multiple_choice' ? question.correctAnswer : undefined,
        explanation: question.type === 'multiple_choice' ? question.explanation : undefined,
        suggestion: question.type === 'written' ? (question.correction || question.expectedAnswer || undefined) : (question.correction || undefined),
      },
      nextQuestionIndex: session.currentQuestionIndex,
      hasNextQuestion: nextQuestionIndex < allQuestions.length,
    };
  }

  async findBySession(sessionId: string) {
    return this.answerModel.find({ sessionId }).sort({ submittedAt: 1 });
  }

  async calculateSessionScore(sessionId: string) {
    const session = await this.studentSessionModel.findById(sessionId);
    const answers = await this.findBySession(sessionId);

    const questionPoints = new Map<string, number>();
    const questionTypes = new Map<string, string>();
    let totalQuestions = answers.length;
    if (session) {
      try {
        const questions = await this.questionsService.findByLesson(session.lessonId.toString());
        totalQuestions = questions.length;
        questions.forEach((q: any) => {
          questionPoints.set(q._id.toString(), q.points ?? 1);
          questionTypes.set(q._id.toString(), q.type);
        });
      } catch {
        // lesson supprimee : on ignore, fallback ci-dessous
      }
    }

    let totalPoints = 0;
    let earnedPoints = 0;
    let correctCount = 0;
    let incorrectCount = 0;
    let pendingCount = 0;

    questionPoints.forEach((pts) => {
      totalPoints += pts || 0;
    });

    const answeredIds = new Set(answers.map((a) => a.questionId?.toString()));
    questionTypes.forEach((type, qid) => {
      if (!answeredIds.has(qid) && type === 'written') {
        pendingCount++;
      }
    });

    answers.forEach((answer: any) => {
      earnedPoints += answer.points || 0;
      const isWrittenPending =
        questionTypes.get(answer.questionId?.toString()) === 'written' && answer.reviewedByTeacher !== true;
      if (answer.isCorrect) {
        correctCount++;
      } else if (isWrittenPending) {
        // Ecrit non relu par le prof : en attente, pas un echec
        pendingCount++;
      } else {
        incorrectCount++;
      }
    });

    // Fallback si questions introuvables (ex: lesson supprimee) : total = somme des points obtenus max
    if (totalPoints === 0 && answers.length > 0) {
      totalPoints = earnedPoints;
    }

    const percentage = totalPoints > 0 ? Math.round((earnedPoints / totalPoints) * 100) : 0;

    return {
      totalQuestions,
      correctCount,
      incorrectCount,
      pendingCount,
      totalPoints,
      earnedPoints,
      percentage,
    };
  }

  async findById(id: string) {
    const answer = await this.answerModel.findById(id);
    if (!answer) {
      throw new NotFoundException('Answer not found');
    }
    return answer;
  }

  async updateAnswer(id: string, updateData: { isCorrect?: boolean; points?: number; teacherFeedback?: string; reviewedByTeacher?: boolean }) {
    const answer = await this.findById(id);
    Object.assign(answer, updateData);
    return answer.save();
  }
}