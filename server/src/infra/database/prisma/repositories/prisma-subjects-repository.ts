import { SubjectsRepository } from "@/application/repositories/subjects-repository";

import { prisma } from "@/infra/database/prisma/client";

export class PrismaSubjectsRepository implements SubjectsRepository {
  async findById(id: string) {
    return await prisma.subject.findUnique({ where: { id } });
  }

  // TODO: fix later
  async findByCourseId(courseId: string) {
    return await prisma.subject.findMany();
  }
}
