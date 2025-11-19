import {
  CourseSubjectsRepository,
  CreateSubjectAttachment,
} from "@/application/repositories/course-subjects-repository";

import { prisma } from "@/infra/database/prisma/client";

export class PrismaCourseSubjectsRepository
  implements CourseSubjectsRepository
{
  async create({ courseId, subjectId, semester }: CreateSubjectAttachment) {
    return await prisma.courseSubject.create({
      data: { courseId, subjectId, semester },
    });
  }

  async findByCourseAndSubject(courseId: string, subjectId: string) {
    return await prisma.courseSubject.findUnique({
      where: { courseId_subjectId: { courseId, subjectId } },
    });
  }

  async delete(courseId: string, subjectId: string) {
    await prisma.courseSubject.delete({
      where: { courseId_subjectId: { courseId, subjectId } },
    });
  }
}
