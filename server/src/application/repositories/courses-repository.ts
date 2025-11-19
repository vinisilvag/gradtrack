import type { Course } from "@prisma/client";

export interface CreateCourse {
  name: string;
  totalHours: number;
}

export interface CoursesRepository {
  create: (data: CreateCourse) => Promise<Course>;
  findMany: () => Promise<Course[]>;
  findById: (id: string) => Promise<Course | null>;
  findByName: (name: string) => Promise<Course | null>;
  delete: (id: string) => Promise<void>;
}
