import {
  CreateSubjectAttachment,
  CourseSubjectsRepository,
} from "@/application/repositories/course-subjects-repository";

import { type CourseSubject } from "@prisma/client";

export class InMemoryCourseSubjectsRepository
  implements CourseSubjectsRepository
{
  public courseSubjects: CourseSubject[] = [];

  async create(data: CreateSubjectAttachment) {
    const createdCourseSubject = {
      ...data,
      id: crypto.randomUUID(),
    };
    this.courseSubjects.push(createdCourseSubject);
    return createdCourseSubject;
  }

  async findByCourseAndSubject(courseId: string, subjectId: string) {
    const courseSubject = this.courseSubjects.find(
      (courseSubject) =>
        courseSubject.courseId === courseId &&
        courseSubject.subjectId === subjectId,
    );
    if (!courseSubject) return null;
    return courseSubject;
  }

  async delete(courseId: string, subjectId: string) {
    const courseSubjectsLeft = this.courseSubjects.filter(
      (courseSubject) =>
        courseSubject.courseId !== courseId ||
        courseSubject.subjectId !== subjectId,
    );
    this.courseSubjects = courseSubjectsLeft;
  }
}
