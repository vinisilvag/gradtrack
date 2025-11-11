import { CoursesRepository } from "@/application/repositories/courses-repository";

import { prisma } from "@/infra/database/prisma/client";

export class PrismaCoursesRepository implements CoursesRepository {
  async findMany() {
    return await prisma.course.findMany();
  }

  async findById(id: string) {
    return await prisma.course.findUnique({ where: { id } });
  }
}
