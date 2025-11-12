import {
  ProgressRepository,
  UpdateOrInsertProgress,
} from "@/application/repositories/progress-repository";

import { ProgressStatus, type Progress } from "@prisma/client";

export class InMemoryProgressRepository implements ProgressRepository {
  public progress: Progress[] = [];

  async updateOrInsertProgress({
    studentId,
    subjectId,
    grade,
    status,
  }: UpdateOrInsertProgress) {
    const index = this.progress.findIndex(
      (progress) =>
        progress.studentId === studentId && progress.subjectId === subjectId,
    );

    if (index < 0) {
      const createdUpdate = {
        studentId,
        subjectId,
        grade: grade || null,
        status: status as ProgressStatus,
        id: crypto.randomUUID(),
      };
      this.progress.push(createdUpdate);
      return createdUpdate;
    } else {
      this.progress[index].grade = grade || null;
      this.progress[index].status = status as ProgressStatus;
      return this.progress[index];
    }
  }
}
