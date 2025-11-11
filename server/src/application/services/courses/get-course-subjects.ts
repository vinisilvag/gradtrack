import { inject as Inject, injectable as Injectable } from "tsyringe";
import { CoursesRepository } from "@/application/repositories/courses-repository";
import { SubjectsRepository } from "@/application/repositories/subjects-repository";

import type { Subject } from "@prisma/client";
import { CourseNotFound } from "@/application/errors/courses/course-not-found";

interface GetCourseSubjectsRequest {
  courseId: string;
}

interface GetCourseSubjectsResponse {
  subjects: Subject[];
}

@Injectable()
export class GetCourseSubjects {
  constructor(
    @Inject("CoursesRepository")
    private readonly coursesRepository: CoursesRepository,

    @Inject("SubjectsRepository")
    private readonly subjectsRepository: SubjectsRepository,
  ) {}

  async execute({
    courseId,
  }: GetCourseSubjectsRequest): Promise<GetCourseSubjectsResponse> {
    const course = await this.coursesRepository.findById(courseId);

    if (!course) {
      throw new CourseNotFound();
    }

    const subjects = await this.subjectsRepository.findByCourseId(courseId);

    return { subjects };
  }
}
