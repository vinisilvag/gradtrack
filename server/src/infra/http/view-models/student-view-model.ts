/** biome-ignore-all lint/complexity/noStaticOnlyClass: <explanation> */
import type { Student } from "@prisma/client";

interface HTTPStudent {
  id: string;
  name: string;
  email: string;
  courseId: string;
}

export class StudentViewModel {
  static toHTTP(student: Student): HTTPStudent {
    return {
      id: student.id,
      name: student.name,
      email: student.email,
      courseId: student.email,
    };
  }
}
