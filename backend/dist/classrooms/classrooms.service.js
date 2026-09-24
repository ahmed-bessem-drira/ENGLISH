"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClassroomsService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const classroom_schema_1 = require("./schemas/classroom.schema");
const lessons_service_1 = require("../lessons/lessons.service");
const lesson_schema_1 = require("../lessons/schemas/lesson.schema");
let ClassroomsService = class ClassroomsService {
    constructor(classroomModel, lessonModel, lessonsService) {
        this.classroomModel = classroomModel;
        this.lessonModel = lessonModel;
        this.lessonsService = lessonsService;
    }
    async create(createClassroomDto, teacherId) {
        const classroom = new this.classroomModel({ ...createClassroomDto, teacherId, lessonIds: [], lessonCodes: [] });
        return classroom.save();
    }
    async findAll(teacherId) {
        const classrooms = await this.classroomModel.find({ teacherId }).sort({ createdAt: -1 });
        const out = [];
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
    async findOne(id, teacherId) {
        const classroom = await this.classroomModel.findById(id);
        if (!classroom || classroom.teacherId !== teacherId) {
            throw new common_1.NotFoundException('Class not found');
        }
        const codes = await this.ensureCodes(classroom);
        const lessons = [];
        const staleIds = [];
        for (const lessonId of classroom.lessonIds || []) {
            try {
                const lesson = await this.lessonsService.findOne(lessonId, teacherId);
                lessons.push({ ...lesson.toObject(), classCode: codes[lessonId] });
            }
            catch {
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
            lessonIds: (classroom.lessonIds || []).filter((lid) => !staleIds.includes(lid)),
            lessons,
            createdAt: classroom.createdAt,
            updatedAt: classroom.updatedAt,
        };
    }
    async update(id, updateClassroomDto, teacherId) {
        const classroom = await this.classroomModel.findById(id);
        if (!classroom || classroom.teacherId !== teacherId) {
            throw new common_1.NotFoundException('Class not found');
        }
        return this.classroomModel.findByIdAndUpdate(id, updateClassroomDto, { new: true });
    }
    async remove(id, teacherId) {
        const classroom = await this.classroomModel.findById(id);
        if (!classroom || classroom.teacherId !== teacherId) {
            throw new common_1.NotFoundException('Class not found');
        }
        await this.classroomModel.findByIdAndDelete(id);
    }
    async attachLesson(id, lessonId, teacherId) {
        const classroom = await this.classroomModel.findById(id);
        if (!classroom || classroom.teacherId !== teacherId) {
            throw new common_1.NotFoundException('Class not found');
        }
        await this.lessonsService.findOne(lessonId, teacherId);
        if (!(classroom.lessonIds || []).includes(lessonId)) {
            classroom.lessonIds.push(lessonId);
        }
        await this.ensureCodes(classroom, [lessonId]);
        await classroom.save();
        const codes = this.codesMap(classroom);
        return { lessonId, classCode: codes[lessonId] };
    }
    async detachLesson(id, lessonId, teacherId) {
        const classroom = await this.classroomModel.findById(id);
        if (!classroom || classroom.teacherId !== teacherId) {
            throw new common_1.NotFoundException('Class not found');
        }
        classroom.lessonIds = (classroom.lessonIds || []).filter((lid) => lid !== lessonId);
        classroom.lessonCodes = (classroom.lessonCodes || []).filter((lc) => lc.lessonId !== lessonId);
        await classroom.save();
        return { detached: true };
    }
    async regenerateLessonCode(id, lessonId, teacherId) {
        const classroom = await this.classroomModel.findById(id);
        if (!classroom || classroom.teacherId !== teacherId) {
            throw new common_1.NotFoundException('Class not found');
        }
        if (!(classroom.lessonIds || []).includes(lessonId)) {
            throw new common_1.NotFoundException('Lesson is not in this class');
        }
        await this.lessonsService.findOne(lessonId, teacherId);
        const newCode = await this.generateUniqueClassCode();
        classroom.lessonCodes = (classroom.lessonCodes || []).filter((lc) => lc.lessonId !== lessonId);
        classroom.lessonCodes.push({ lessonId, accessCode: newCode });
        await classroom.save();
        return { lessonId, classCode: newCode };
    }
    async findByClassCode(accessCode) {
        const code = (accessCode || '').trim();
        if (!code)
            return null;
        const classroom = await this.classroomModel.findOne({
            'lessonCodes.accessCode': { $regex: new RegExp(`^${code}$`, 'i') },
        });
        if (!classroom)
            return null;
        const entry = (classroom.lessonCodes || []).find((lc) => lc.accessCode && lc.accessCode.trim().toUpperCase() === code.toUpperCase());
        if (!entry)
            return null;
        return { classroom, lessonId: entry.lessonId };
    }
    codesMap(classroom) {
        const map = {};
        for (const lc of classroom.lessonCodes || []) {
            map[lc.lessonId] = lc.accessCode;
        }
        return map;
    }
    async ensureCodes(classroom, onlyIds) {
        const ids = onlyIds || classroom.lessonIds || [];
        let changed = false;
        classroom.lessonCodes = classroom.lessonCodes || [];
        for (const lessonId of ids) {
            if (!(classroom.lessonIds || []).includes(lessonId))
                continue;
            const exists = classroom.lessonCodes.some((lc) => lc.lessonId === lessonId);
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
    async generateUniqueClassCode() {
        const characters = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
        for (let attempt = 0; attempt < 50; attempt++) {
            let code = '';
            for (let i = 0; i < 6; i++) {
                code += characters.charAt(Math.floor(Math.random() * characters.length));
            }
            const lessonClash = await this.lessonModel.findOne({ accessCode: code });
            if (lessonClash)
                continue;
            const classClash = await this.classroomModel.findOne({ 'lessonCodes.accessCode': code });
            if (classClash)
                continue;
            return code;
        }
        throw new Error('Could not generate a unique class code');
    }
};
exports.ClassroomsService = ClassroomsService;
exports.ClassroomsService = ClassroomsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(classroom_schema_1.Classroom.name)),
    __param(1, (0, mongoose_1.InjectModel)(lesson_schema_1.Lesson.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        mongoose_2.Model,
        lessons_service_1.LessonsService])
], ClassroomsService);
//# sourceMappingURL=classrooms.service.js.map