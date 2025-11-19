import type { CourseSubject } from "@prisma/client";

export interface CreateSubjectAttachment {
  courseId: string;
  subjectId: string;
  semester: number;
}

export interface CourseSubjectsRepository {
  create: (data: CreateSubjectAttachment) => Promise<CourseSubject>;
  findByCourseAndSubject: (
    courseId: string,
    subjectId: string,
  ) => Promise<CourseSubject | null>;
  delete: (courseId: string, subjectId: string) => Promise<void>;
}
