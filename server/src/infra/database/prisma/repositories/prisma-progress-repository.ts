import {
  ProgressRepository,
  UpdateOrInsertProgress,
} from "@/application/repositories/progress-repository";

import { prisma } from "@/infra/database/prisma/client";

import { ProgressStatus } from "@prisma/client";

export class PrismaProgressRepository implements ProgressRepository {
  async updateOrInsertProgress({
    studentId,
    subjectId,
    grade,
    status,
  }: UpdateOrInsertProgress) {
    const update = await prisma.progress.upsert({
      where: { studentId_subjectId: { studentId, subjectId } },
      update: { status: status as ProgressStatus, grade },
      create: { studentId, subjectId, status: status as ProgressStatus, grade },
    });

    return update;
  }
}
