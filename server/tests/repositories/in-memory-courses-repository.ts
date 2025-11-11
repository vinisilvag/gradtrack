import {
  CoursesRepository,
  CreateCourse,
} from "@/application/repositories/courses-repository";

import { type Course } from "@prisma/client";

export class InMemoryCoursesRepository implements CoursesRepository {
  public courses: Course[] = [];

  async create(data: CreateCourse) {
    const createdCourse = {
      ...data,
      id: crypto.randomUUID(),
    };
    this.courses.push(createdCourse);
    return createdCourse;
  }

  async findMany() {
    return this.courses;
  }

  async findById(id: string) {
    const course = this.courses.find((course) => course.id === id);
    if (!course) return null;
    return course;
  }
}
