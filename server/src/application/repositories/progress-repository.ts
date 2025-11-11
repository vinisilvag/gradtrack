import type { Progress } from "@prisma/client";

export interface UpdateOrInsertProgress {
  studentId: string;
  subjectId: string;
  status: string;
  grade: number;
}

export interface ProgressRepository {
  updateOrInsertProgress: (
    updateOrInsertProgressData: UpdateOrInsertProgress,
  ) => Promise<Progress | null>;
}
