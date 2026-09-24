import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { StudentSession, StudentSessionDocument } from './schemas/student-session.schema';
import { JoinLessonDto } from './dto/join-lesson.dto';
import { LessonsService } from '../lessons/lessons.service';
import { QuestionsService } from '../questions/questions.service';
import { AnswersService } from '../answers/answers.service';
import { ClassroomsService } from '../classrooms/classrooms.service';
import * as crypto from 'crypto';

@Injectable()
export class StudentsService {
  constructor(
    @InjectModel(StudentSession.name) private studentSessionModel: Model<StudentSessionDocument>,
    private lessonsService: LessonsService,
    private questionsService: QuestionsService,
    private answersService: AnswersService,
    private classroomsService: ClassroomsService,
  ) {}

  async joinLesson(joinLessonDto: JoinLessonDto) {
    const accessCode = joinLessonDto.accessCode?.trim().toUpperCase();
    const studentName = joinLessonDto.studentName?.trim();

    // 1) Code de classe (classe x lecon) en priorite -> eleve tague avec sa classe.
    // 2) Sinon code general de la lecon -> pas de classe.
    let lesson: any = null;
    let classroomId: string | undefined;
    let className: string | undefined;

    const classMatch = await this.classroomsService.findByClassCode(accessCode);
    if (classMatch) {
      try {
        lesson = await this.lessonsService.findOne(classMatch.lessonId);
        classroomId = (classMatch.classroom as any)._id.toString();
        className = classMatch.classroom.name;
      } catch {
        lesson = await this.lessonsService.findByAccessCode(accessCode);
      }
    } else {
      lesson = await this.lessonsService.findByAccessCode(accessCode);
    }

    if (!lesson) {
      throw new NotFoundException(`Lesson code "${accessCode}" not found. Please verify the code with your teacher.`);
    }

    if (lesson.status !== 'Active') {
      throw new BadRequestException('This lesson is not active yet. Ask your teacher to activate it.');
    }

    const lessonId = (lesson as any)._id.toString();
    const questions = await this.questionsService.findByLesson(lessonId);
    if (questions.length === 0) {
      throw new BadRequestException('This lesson has no questions yet');
    }

    const sessionToken = this.generateSessionToken();

    const session = new this.studentSessionModel({
      lessonId: lessonId,
      studentName,
      sessionToken,
      currentQuestionIndex: 0,
      status: 'NOT_STARTED',
      classroomId,
      className,
    });

    await session.save();

    return {
      sessionToken,
      lesson: {
        id: lessonId,
        title: lesson.title,
        description: lesson.description,
        difficulty: lesson.difficulty,
        category: lesson.category,
        accessCode: lesson.accessCode,
        settings: lesson.settings,
      },
      student: {
        name: studentName,
      },
      class: classroomId ? { id: classroomId, name: className } : null,
      totalQuestions: questions.length,
    };
  }

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

  async getSession(sessionToken: string) {
    const session = await this.findSession(sessionToken);
    if (!session) {
      throw new NotFoundException('Session not found');
    }

    const lesson = await this.lessonsService.findOne(session.lessonId.toString());
    const questions = await this.questionsService.findByLesson(session.lessonId.toString());
    const sessionId = (session as any)._id.toString();
    const lessonId = (lesson as any)._id.toString();

    return {
      session: {
        id: sessionId,
        token: session.sessionToken,
        status: session.status,
        currentQuestionIndex: session.currentQuestionIndex,
        startedAt: session.startedAt,
        completedAt: session.completedAt,
      },
      lesson: {
        id: lessonId,
        title: lesson.title,
        description: lesson.description,
        difficulty: lesson.difficulty,
        category: lesson.category,
        settings: lesson.settings,
      },
      student: {
        name: session.studentName,
      },
      class: session.classroomId ? { id: session.classroomId, name: session.className } : null,
      totalQuestions: questions.length,
    };
  }

  async startSession(sessionToken: string) {
    const session = await this.findSession(sessionToken);
    if (!session) {
      throw new NotFoundException('Session not found');
    }

    if (session.status !== 'NOT_STARTED') {
      return this.getSession(sessionToken);
    }

    session.status = 'IN_PROGRESS';
    session.startedAt = new Date();
    session.currentQuestionIndex = 0;

    await session.save();

    return this.getSession(sessionToken);
  }

  async getCurrentQuestion(sessionToken: string) {
    const session = await this.findSession(sessionToken);
    if (!session) {
      throw new NotFoundException('Session not found');
    }

    if (session.status !== 'IN_PROGRESS') {
      throw new BadRequestException('Session is not in progress');
    }

    const questions = await this.questionsService.findByLesson(session.lessonId.toString());
    
    if (session.currentQuestionIndex >= questions.length) {
      throw new BadRequestException('No more questions');
    }

    const currentQuestion = questions[session.currentQuestionIndex];
    const questionId = (currentQuestion as any)._id.toString();

    return {
      question: {
        id: questionId,
        type: currentQuestion.type,
        text: currentQuestion.text,
        order: currentQuestion.order,
        options: currentQuestion.options,
        points: currentQuestion.points,
      },
      currentIndex: session.currentQuestionIndex,
      totalQuestions: questions.length,
      allowPrevious: false,
    };
  }

  async getSessionReview(sessionToken: string) {
    const session = await this.findSession(sessionToken);
    if (!session) {
      throw new NotFoundException('Session not found');
    }

    const sessionId = (session as any)._id.toString();
    const questions = await this.questionsService.findByLesson(session.lessonId.toString());
    const answers = await this.answersService.findBySession(sessionId);
    const answerMap = new Map(answers.map((a: any) => [a.questionId?.toString(), a]));

    return questions.map((q: any) => {
      const qid = q._id.toString();
      const a: any = answerMap.get(qid);
      const reviewed = a?.reviewedByTeacher === true;
      const pendingReview = q.type === 'written' && !reviewed;
      return {
        questionId: qid,
        order: q.order,
        type: q.type,
        text: q.text,
        options: q.type === 'multiple_choice' ? q.options : undefined,
        studentAnswer: a?.answer ?? null,
        isCorrect: a ? !!a.isCorrect : false,
        points: a?.points ?? 0,
        maxPoints: q.points ?? 1,
        reviewedByTeacher: reviewed,
        pendingReview,
        teacherFeedback: a?.teacherFeedback,
        correctAnswer: q.type === 'multiple_choice' ? q.correctAnswer : undefined,
        explanation: q.type === 'multiple_choice' ? (q.explanation || undefined) : undefined,
        suggestion: q.type === 'written' ? (q.correction || q.expectedAnswer || undefined) : (q.correction || undefined),
      };
    });
  }

  async completeSession(sessionToken: string) {
    const session = await this.findSession(sessionToken);
    if (!session) {
      throw new NotFoundException('Session not found');
    }

    if (session.status === 'COMPLETED') {
      const sessionId = (session as any)._id.toString();
      const existing = await this.answersService.calculateSessionScore(sessionId);
      return {
        session: {
          id: sessionId,
          status: session.status,
          completedAt: session.completedAt,
        },
        result: existing,
      };
    }

    session.status = 'COMPLETED';
    session.completedAt = session.completedAt || new Date();

    await session.save();

    const sessionId = (session as any)._id.toString();
    const result = await this.answersService.calculateSessionScore(sessionId);

    return {
      session: {
        id: sessionId,
        status: session.status,
        completedAt: session.completedAt,
      },
      result,
    };
  }

  private generateSessionToken(): string {
    return crypto.randomBytes(32).toString('hex');
  }
}