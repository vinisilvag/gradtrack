import type { Subject } from "@prisma/client";

export interface SubjectsRepository {
  findById: (id: string) => Promise<Subject | null>;
  findByCourseId: (courseId: string) => Promise<Subject[]>;
}
