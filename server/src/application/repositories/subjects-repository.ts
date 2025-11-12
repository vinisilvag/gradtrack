import type { Subject } from "@prisma/client";

export interface CreateSubject {
  name: string;
  code: string;
  hours: number;
  category: string;
}

export interface SubjectsRepository {
  create: (data: CreateSubject) => Promise<Subject>;
  findById: (id: string) => Promise<Subject | null>;
}
