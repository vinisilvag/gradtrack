import { inject as Inject, injectable as Injectable } from "tsyringe";
import { CoursesRepository } from "@/application/repositories/courses-repository";

import type { Course } from "@prisma/client";

interface GetCoursesResponse {
  courses: Course[];
}

@Injectable()
export class GetCourses {
  constructor(
    @Inject("CoursesRepository")
    private readonly coursesRepository: CoursesRepository,
  ) {}

  async execute(): Promise<GetCoursesResponse> {
    const courses = await this.coursesRepository.findMany();
    return { courses };
  }
}
