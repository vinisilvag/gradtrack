import type { Course } from "@prisma/client";

export interface CoursesRepository {
  findMany: () => Promise<Course[]>;
  findById: (id: string) => Promise<Course | null>;
}
