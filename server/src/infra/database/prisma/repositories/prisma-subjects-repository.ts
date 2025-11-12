import {
  CreateSubject,
  SubjectsRepository,
} from "@/application/repositories/subjects-repository";

import { prisma } from "@/infra/database/prisma/client";

import { SubjectCategory } from "@prisma/client";

export class PrismaSubjectsRepository implements SubjectsRepository {
  async create({ name, code, hours, category }: CreateSubject) {
    return await prisma.subject.create({
      data: { name, code, hours, category: category as SubjectCategory },
    });
  }

  async findById(id: string) {
    return await prisma.subject.findUnique({ where: { id } });
  }
}
