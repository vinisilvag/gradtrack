import type { Subject } from "@prisma/client";

export interface CreateSubject {
  name: string;
  code: string;
  hours: number;
  category: string;
}

export interface SubjectsRepository {
  create: (data: CreateSubject) => Promise<Subject>;
  findMany: () => Promise<Subject[]>;
  findById: (id: string) => Promise<Subject | null>;
  findByCode: (code: string) => Promise<Subject | null>;
  delete: (id: string) => Promise<void>;
}
