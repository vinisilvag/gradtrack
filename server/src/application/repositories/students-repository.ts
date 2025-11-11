import type { Student } from "@prisma/client";

export interface CreateStudent {
  name: string;
  email: string;
  courseId: string;
}

export interface StudentsRepository {
  findMany: () => Promise<Student[]>;
  findById: (id: string) => Promise<Student | null>;
  findByEmail: (email: string) => Promise<Student | null>;
  findByCourseId: (courseId: string) => Promise<Student[]>;
  create: (data: CreateStudent) => Promise<Student>;
}
