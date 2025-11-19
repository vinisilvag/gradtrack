import {
  CreateStudent,
  StudentsRepository,
} from "@/application/repositories/students-repository";

import { prisma } from "@/infra/database/prisma/client";

export class PrismaStudentsRepository implements StudentsRepository {
  async findMany() {
    return await prisma.student.findMany();
  }

  async findById(id: string) {
    return await prisma.student.findUnique({
      where: { id },
      include: { course: true, progress: { include: { subject: true } } },
    });
  }

  async findByEmail(email: string) {
    return await prisma.student.findUnique({ where: { email } });
  }

  async findByCourseId(courseId: string) {
    return await prisma.student.findMany({ where: { courseId } });
  }

  async create(data: CreateStudent) {
    const { name, email, courseId } = data;

    const student = await prisma.student.create({
      data: {
        name,
        email,
        courseId,
      },
    });

    return student;
  }

  async delete(id: string) {
    await prisma.student.delete({ where: { id } });
  }
}
