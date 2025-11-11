/** biome-ignore-all lint/complexity/noStaticOnlyClass: <explanation> */
import type { Course } from "@prisma/client";

interface HTTPCourse {
  id: string;
  name: string;
  totalHours: number;
}

export class CourseViewModel {
  static toHTTP(course: Course): HTTPCourse {
    return {
      id: course.id,
      name: course.name,
      totalHours: course.totalHours,
    };
  }
}
