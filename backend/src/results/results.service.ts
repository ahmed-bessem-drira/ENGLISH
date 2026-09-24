import { Injectable, NotFoundException, ForbiddenException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, isValidObjectId } from 'mongoose';
import { StudentSession, StudentSessionDocument } from '../students/schemas/student-session.schema';
import { Answer, AnswerDocument } from '../answers/schemas/answer.schema';
import { Question, QuestionDocument } from '../questions/schemas/question.schema';
import { Lesson, LessonDocument } from '../lessons/schemas/lesson.schema';
import { Classroom, ClassroomDocument } from '../classrooms/schemas/classroom.schema';
import { AnswersService } from '../answers/answers.service';

@Injectable()
export class ResultsService {
  constructor(
    @InjectModel(StudentSession.name) private studentSessionModel: Model<StudentSessionDocument>,
    @InjectModel(Answer.name) private answerModel: Model<AnswerDocument>,
    @InjectModel(Question.name) private questionModel: Model<QuestionDocument>,
    @InjectModel(Lesson.name) private lessonModel: Model<LessonDocument>,
    @InjectModel(Classroom.name) private classroomModel: Model<ClassroomDocument>,
    private answersService: AnswersService,
  ) {}

  async getLessonResults(lessonId: string, teacherId: string, classroomId?: string) {
    const lesson = await this.lessonModel.findById(lessonId);
    if (!lesson) {
      throw new NotFoundException('Lesson not found');
    }

    if (lesson.teacherId !== teacherId) {
      throw new ForbiddenException('You do not have access to this lesson');
    }

    let className: string | null = null;
    const sessionFilter: any = { lessonId };
    if (classroomId) {
      if (!isValidObjectId(classroomId)) {
        throw new NotFoundException('Class not found');
      }
      const classroom: any = await this.classroomModel.findById(classroomId);
      if (!classroom || classroom.teacherId !== teacherId) {
        throw new NotFoundException('Class not found');
      }
      sessionFilter.classroomId = classroomId;
      className = classroom.name;
    }

    const sessions = await this.studentSessionModel.find(sessionFilter).sort({ createdAt: -1 });

    const results = await Promise.all(
      sessions.map(async (session) => {
        const score = await this.answersService.calculateSessionScore(session._id.toString());
        return {
          sessionId: session._id.toString(),
          studentName: session.studentName,
          status: session.status,
          className: session.className || null,
          score: score.earnedPoints,
          totalPoints: score.totalPoints,
          percentage: score.percentage,
          pendingCount: score.pendingCount || 0,
          startedAt: session.startedAt,
          completedAt: session.completedAt,
        };
      })
    );

    const completedCount = results.filter(r => r.status === 'COMPLETED').length;
    const averageScore = completedCount > 0 
      ? Math.round(results.filter(r => r.status === 'COMPLETED').reduce((sum, r) => sum + r.percentage, 0) / completedCount)
      : 0;

    return {
      lesson: {
        id: lesson._id.toString(),
        title: lesson.title,
        accessCode: lesson.accessCode,
      },
      classroom: classroomId ? { id: classroomId, name: className } : null,
      statistics: {
        totalParticipants: sessions.length,
        completedCount,
        averageScore,
      },
      results,
    };
  }

  async getSessionDetails(sessionId: string, teacherId: string, lessonId?: string) {
    const session = await this.studentSessionModel.findById(sessionId);
    if (!session) {
      throw new NotFoundException('Session not found');
    }

    if (lessonId && session.lessonId.toString() !== lessonId.toString()) {
      throw new ForbiddenException('Session does not belong to this lesson');
    }

    const lesson = await this.lessonModel.findById(session.lessonId);
    if (!lesson || lesson.teacherId !== teacherId) {
      throw new ForbiddenException('You do not have access to this session');
    }

    const answers = await this.answerModel.find({ sessionId }).sort({ submittedAt: 1 });
    const questions = await this.questionModel.find({ lessonId: session.lessonId }).sort({ order: 1 });

    const questionMap = new Map(questions.map(q => [q._id.toString(), q]));

    const answerDetails = answers.map(answer => {
      const question = questionMap.get(answer.questionId);
      return {
        id: answer._id.toString(),
        questionId: answer.questionId,
        questionText: question?.text || '',
        questionType: question?.type || '',
        studentAnswer: answer.answer,
        correctAnswer: question?.correctAnswer || question?.expectedAnswer || '',
        isCorrect: answer.isCorrect,
        points: answer.points,
        maxPoints: question?.points || 1,
        teacherFeedback: answer.teacherFeedback,
        reviewedByTeacher: answer.reviewedByTeacher,
        submittedAt: answer.submittedAt,
      };
    });

    const score = await this.answersService.calculateSessionScore(sessionId);

    return {
      session: {
        id: session._id.toString(),
        studentName: session.studentName,
        status: session.status,
        className: session.className || null,
        startedAt: session.startedAt,
        completedAt: session.completedAt,
      },
      score,
      answers: answerDetails,
    };
  }

  async reviewAnswer(answerId: string, teacherId: string, reviewData: { isCorrect: boolean; points: number; teacherFeedback?: string }, lessonId?: string) {    const answer = await this.answerModel.findById(answerId);
    if (!answer) {
      throw new NotFoundException('Answer not found');
    }

    const session = await this.studentSessionModel.findById(answer.sessionId);
    if (!session) {
      throw new NotFoundException('Session not found');
    }

    if (lessonId && session.lessonId.toString() !== lessonId.toString()) {
      throw new ForbiddenException('Answer does not belong to this lesson');
    }

    if (typeof reviewData.points !== 'number' || reviewData.points < 0) {
      throw new BadRequestException('Points must be a positive number');
    }

    const lesson = await this.lessonModel.findById(session.lessonId);
    if (!lesson || lesson.teacherId !== teacherId) {
      throw new ForbiddenException('You do not have access to this answer');
    }

    return this.answersService.updateAnswer(answerId, {
      ...reviewData,
      reviewedByTeacher: true,
    });
  }

  /** Purge tous les resultats d'une lecon (sessions + reponses) pour liberer de l'espace. */
  async deleteLessonResults(lessonId: string, teacherId: string) {
    const lesson = await this.lessonModel.findById(lessonId);
    if (!lesson) {
      throw new NotFoundException('Lesson not found');
    }
    if (lesson.teacherId !== teacherId) {
      throw new ForbiddenException('You do not have access to this lesson');
    }
    const sessions = await this.studentSessionModel.find({ lessonId });
    const sessionIds = sessions.map((s: any) => s._id.toString());
    const deletedAnswers = sessionIds.length > 0
      ? (await this.answerModel.deleteMany({ sessionId: { $in: sessionIds } })).deletedCount
      : 0;
    const deletedSessions = (await this.studentSessionModel.deleteMany({ lessonId })).deletedCount;
    return { deletedSessions, deletedAnswers };
  }
}