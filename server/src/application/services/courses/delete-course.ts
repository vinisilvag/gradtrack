import { inject as Inject, injectable as Injectable } from "tsyringe";

import type { CoursesRepository } from "@/application/repositories/courses-repository";
import { CourseNotFound } from "@/application/errors/courses/course-not-found";

interface DeleteCourseRequest {
  courseId: string;
}

@Injectable()
export class DeleteCourse {
  constructor(
    @Inject("CoursesRepository")
    private readonly coursesRepository: CoursesRepository,
  ) {}

  async execute({ courseId }: DeleteCourseRequest): Promise<void> {
    const course = await this.coursesRepository.findById(courseId);

    if (!course) {
      throw new CourseNotFound();
    }

    await this.coursesRepository.delete(courseId);
  }
}
