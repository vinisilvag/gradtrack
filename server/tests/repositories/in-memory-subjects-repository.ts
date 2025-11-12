import {
  CreateSubject,
  SubjectsRepository,
} from "@/application/repositories/subjects-repository";

import { SubjectCategory, type Subject } from "@prisma/client";

export class InMemorySubjectsRepository implements SubjectsRepository {
  public subjects: Subject[] = [];

  async create({ name, hours, code, category }: CreateSubject) {
    const createdSubject = {
      name,
      hours,
      code,
      category: category as SubjectCategory,
      id: crypto.randomUUID(),
    };
    this.subjects.push(createdSubject);
    return createdSubject;
  }

  async findById(id: string) {
    const subject = this.subjects.find((subject) => subject.id === id);
    if (!subject) return null;
    return subject;
  }
}
