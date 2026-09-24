import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Classroom, ClassroomDocument } from './schemas/classroom.schema';
import { CreateClassroomDto } from './dto/create-classroom.dto';
import { UpdateClassroomDto } from './dto/update-classroom.dto';
import { LessonsService } from '../lessons/lessons.service';
import { Lesson, LessonDocument } from '../lessons/schemas/lesson.schema';

@Injectable()
export class ClassroomsService {
  constructor(
    @InjectModel(Classroom.name) private classroomModel: Model<ClassroomDocument>,
    @InjectModel(Lesson.name) private lessonModel: Model<LessonDocument>,
    private lessonsService: LessonsService,
  ) {}

  async create(createClassroomDto: CreateClassroomDto, teacherId: string) {
    const classroom = new this.classroomModel({ ...createClassroomDto, teacherId, lessonIds: [], lessonCodes: [] });
    return classroom.save();
  }

  async findAll(teacherId: string) {
    const classrooms: any[] = await this.classroomModel.find({ teacherId }).sort({ createdAt: -1 });
    const out: any[] = [];
    for (const c of classrooms) {
      const codes = await this.ensureCodes(c);
      out.push({
        _id: c._id,
        name: c.name,
        description: c.description,
        lessonIds: c.lessonIds || [],
        lessonCodes: codes,
        lessonCount: (c.lessonIds || []).length,
        createdAt: c.createdAt,
        updatedAt: c.updatedAt,
      });
    }
    return out;
  }

  async findOne(id: string, teacherId: string) {
    const classroom: any = await this.classroomModel.findById(id);
    if (!classroom || classroom.teacherId !== teacherId) {
      throw new NotFoundException('Class not found');
    }

    const codes = await this.ensureCodes(classroom);

    // Lecons assignees, tolerant aux lecons supprimees
    const lessons: any[] = [];
    const staleIds: string[] = [];
    for (const lessonId of classroom.lessonIds || []) {
      try {
        const lesson: any = await this.lessonsService.findOne(lessonId, teacherId);
        lessons.push({ ...lesson.toObject(), classCode: codes[lessonId] });
      } catch {
        staleIds.push(lessonId);
      }
    }
    if (staleIds.length > 0) {
      await this.classroomModel.findByIdAndUpdate(id, {
        $pull: { lessonIds: { $in: staleIds }, lessonCodes: { lessonId: { $in: staleIds } } },
      });
    }

    return {
      _id: classroom._id,
      name: classroom.name,
      description: classroom.description,
      lessonIds: (classroom.lessonIds || []).filter((lid: string) => !staleIds.includes(lid)),
      lessons,
      createdAt: classroom.createdAt,
      updatedAt: classroom.updatedAt,
    };
  }

  async update(id: string, updateClassroomDto: UpdateClassroomDto, teacherId: string) {
    const classroom: any = await this.classroomModel.findById(id);
    if (!classroom || classroom.teacherId !== teacherId) {
      throw new NotFoundException('Class not found');
    }
    return this.classroomModel.findByIdAndUpdate(id, updateClassroomDto, { new: true });
  }

  async remove(id: string, teacherId: string): Promise<void> {
    const classroom: any = await this.classroomModel.findById(id);
    if (!classroom || classroom.teacherId !== teacherId) {
      throw new NotFoundException('Class not found');
    }
    await this.classroomModel.findByIdAndDelete(id);
  }

  async attachLesson(id: string, lessonId: string, teacherId: string) {
    const classroom: any = await this.classroomModel.findById(id);
    if (!classroom || classroom.teacherId !== teacherId) {
      throw new NotFoundException('Class not found');
    }
    // Verifie que la lecon appartient bien au prof (une lecon peut aller dans plusieurs classes)
    await this.lessonsService.findOne(lessonId, teacherId);
    if (!(classroom.lessonIds || []).includes(lessonId)) {
      classroom.lessonIds.push(lessonId);
    }
    await this.ensureCodes(classroom, [lessonId]);
    await classroom.save();
    const codes = this.codesMap(classroom);
    return { lessonId, classCode: codes[lessonId] };
  }

  async detachLesson(id: string, lessonId: string, teacherId: string) {
    const classroom: any = await this.classroomModel.findById(id);
    if (!classroom || classroom.teacherId !== teacherId) {
      throw new NotFoundException('Class not found');
    }
    classroom.lessonIds = (classroom.lessonIds || []).filter((lid: string) => lid !== lessonId);
    classroom.lessonCodes = (classroom.lessonCodes || []).filter((lc: any) => lc.lessonId !== lessonId);
    await classroom.save();
    return { detached: true };
  }

  async regenerateLessonCode(id: string, lessonId: string, teacherId: string) {
    const classroom: any = await this.classroomModel.findById(id);
    if (!classroom || classroom.teacherId !== teacherId) {
      throw new NotFoundException('Class not found');
    }
    if (!(classroom.lessonIds || []).includes(lessonId)) {
      throw new NotFoundException('Lesson is not in this class');
    }
    await this.lessonsService.findOne(lessonId, teacherId);
    const newCode = await this.generateUniqueClassCode();
    classroom.lessonCodes = (classroom.lessonCodes || []).filter((lc: any) => lc.lessonId !== lessonId);
    classroom.lessonCodes.push({ lessonId, accessCode: newCode });
    await classroom.save();
    return { lessonId, classCode: newCode };
  }

  /** Trouve (classe, lecon) par code de classe. Retourne null si aucun match. */
  async findByClassCode(accessCode: string) {
    const code = (accessCode || '').trim();
    if (!code) return null;
    const classroom: any = await this.classroomModel.findOne({
      'lessonCodes.accessCode': { $regex: new RegExp(`^${code}$`, 'i') },
    });
    if (!classroom) return null;
    const entry = (classroom.lessonCodes || []).find(
      (lc: any) => lc.accessCode && lc.accessCode.trim().toUpperCase() === code.toUpperCase(),
    );
    if (!entry) return null;
    return { classroom, lessonId: entry.lessonId };
  }

  private codesMap(classroom: any): Record<string, string> {
    const map: Record<string, string> = {};
    for (const lc of classroom.lessonCodes || []) {
      map[lc.lessonId] = lc.accessCode;
    }
    return map;
  }

  /** Garantit un code unique par lecon rattachee (backfill des anciens rattachements). */
  private async ensureCodes(classroom: any, onlyIds?: string[]): Promise<Record<string, string>> {
    const ids = onlyIds || classroom.lessonIds || [];
    let changed = false;
    classroom.lessonCodes = classroom.lessonCodes || [];
    for (const lessonId of ids) {
      if (!(classroom.lessonIds || []).includes(lessonId)) continue;
      const exists = classroom.lessonCodes.some((lc: any) => lc.lessonId === lessonId);
      if (!exists) {
        classroom.lessonCodes.push({ lessonId, accessCode: await this.generateUniqueClassCode() });
        changed = true;
      }
    }
    if (changed) {
      await classroom.save();
    }
    return this.codesMap(classroom);
  }

  private async generateUniqueClassCode(): Promise<string> {
    const characters = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    for (let attempt = 0; attempt < 50; attempt++) {
      let code = '';
      for (let i = 0; i < 6; i++) {
        code += characters.charAt(Math.floor(Math.random() * characters.length));
      }
      const lessonClash = await this.lessonModel.findOne({ accessCode: code });
      if (lessonClash) continue;
      const classClash = await this.classroomModel.findOne({ 'lessonCodes.accessCode': code });
      if (classClash) continue;
      return code;
    }
    throw new Error('Could not generate a unique class code');
  }
}
