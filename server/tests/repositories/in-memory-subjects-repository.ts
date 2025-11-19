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

  async findMany() {
    return this.subjects;
  }

  async findById(id: string) {
    const subject = this.subjects.find((subject) => subject.id === id);
    if (!subject) return null;
    return subject;
  }

  async findByCode(code: string) {
    const subject = this.subjects.find((subject) => subject.code === code);
    if (!subject) return null;
    return subject;
  }

  async delete(id: string) {
    const subjectsLeft = this.subjects.filter((subject) => subject.id !== id);
    this.subjects = subjectsLeft;
  }
}
