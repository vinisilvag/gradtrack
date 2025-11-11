import type {
  CreateStudent,
  StudentsRepository,
} from "@/application/repositories/students-repository";

import { type Student } from "@prisma/client";

export class InMemoryStudentsRepository implements StudentsRepository {
  public students: Student[] = [];

  async findMany() {
    return this.students;
  }

  async findById(id: string) {
    const student = this.students.find((student) => student.id === id);
    if (!student) return null;
    return student;
  }

  async findByEmail(email: string) {
    const student = this.students.find((student) => student.email === email);
    if (!student) return null;
    return student;
  }

  async findByCourseId(courseId: string) {
    const students = this.students.filter(
      (student) => student.courseId === courseId,
    );
    return students;
  }

  async create(data: CreateStudent) {
    const createdStudent = {
      ...data,
      id: crypto.randomUUID(),
    };
    this.students.push(createdStudent);
    return createdStudent;
  }
}
