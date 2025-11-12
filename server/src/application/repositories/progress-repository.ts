import type { Progress } from "@prisma/client";

export interface UpdateOrInsertProgress {
  studentId: string;
  subjectId: string;
  status: string;
  grade: number | undefined;
}

export interface ProgressRepository {
  updateOrInsertProgress: (
    updateOrInsertProgressData: UpdateOrInsertProgress,
  ) => Promise<Progress | null>;
}
