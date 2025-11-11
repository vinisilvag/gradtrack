import { inject as Inject, injectable as Injectable } from "tsyringe";
import { CoursesRepository } from "@/application/repositories/courses-repository";
import { StudentsRepository } from "@/application/repositories/students-repository";

import type { Student } from "@prisma/client";
import { CourseNotFound } from "@/application/errors/courses/course-not-found";

interface GetCourseStudentsRequest {
  courseId: string;
}

interface GetCourseStudentsResponse {
  students: Student[];
}

@Injectable()
export class GetCourseStudents {
  constructor(
    @Inject("CoursesRepository")
    private readonly coursesRepository: CoursesRepository,

    @Inject("StudentsRepository")
    private readonly studentsRepository: StudentsRepository,
  ) {}

  async execute({
    courseId,
  }: GetCourseStudentsRequest): Promise<GetCourseStudentsResponse> {
    const course = await this.coursesRepository.findById(courseId);

    if (!course) {
      throw new CourseNotFound();
    }

    const students = await this.studentsRepository.findByCourseId(courseId);

    return { students };
  }
}
