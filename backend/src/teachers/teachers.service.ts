import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { Teacher, TeacherDocument } from './schemas/teacher.schema';
import { CreateTeacherDto } from './dto/create-teacher.dto';

@Injectable()
export class TeachersService {
  constructor(
    @InjectModel(Teacher.name) private teacherModel: Model<TeacherDocument>,
  ) {}

  async create(createTeacherDto: CreateTeacherDto): Promise<Teacher> {
    const { email, password, confirmPassword, ...rest } = createTeacherDto;

    if (password !== confirmPassword) {
      throw new ConflictException('Passwords do not match');
    }

    const existingTeacher = await this.teacherModel.findOne({ email });
    if (existingTeacher) {
      throw new ConflictException('Email already exists');
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const teacher = new this.teacherModel({
      ...rest,
      email,
      passwordHash,
    });

    return teacher.save();
  }

  async findByEmail(email: string): Promise<Teacher | null> {
    return this.teacherModel.findOne({ email });
  }

  async findById(id: string): Promise<Teacher> {
    const teacher = await this.teacherModel.findById(id);
    if (!teacher) {
      throw new NotFoundException('Teacher not found');
    }
    return teacher;
  }

  async validatePassword(plainPassword: string, hashedPassword: string): Promise<boolean> {
    return bcrypt.compare(plainPassword, hashedPassword);
  }
}