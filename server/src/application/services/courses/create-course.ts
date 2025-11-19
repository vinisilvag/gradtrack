import { inject as Inject, injectable as Injectable } from "tsyringe";
import { CoursesRepository } from "@/application/repositories/courses-repository";

import type { Course } from "@prisma/client";

import { CourseAlreadyExists } from "@/application/errors/courses/course-already-exists";

interface CreateCourseRequest {
  name: string;
  totalHours: number;
}

interface CreateCourseResponse {
  course: Course;
}

@Injectable()
export class CreateCourse {
  constructor(
    @Inject("CoursesRepository")
    private readonly coursesRepository: CoursesRepository,
  ) {}

  async execute({
    name,
    totalHours,
  }: CreateCourseRequest): Promise<CreateCourseResponse> {
    const courseExists = await this.coursesRepository.findByName(name);
    if (courseExists) {
      throw new CourseAlreadyExists();
    }

    const course = await this.coursesRepository.create({ name, totalHours });

    return { course };
  }
}
