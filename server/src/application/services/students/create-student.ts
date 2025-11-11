import { inject as Inject, injectable as Injectable } from "tsyringe";
import type { StudentsRepository } from "@/application/repositories/students-repository";
import { CoursesRepository } from "@/application/repositories/courses-repository";

import type { Student } from "@prisma/client";

import { StudentAlreadyExists } from "@/application/errors/students/student-already-exists";
import { CourseNotFound } from "@/application/errors/courses/course-not-found";

interface CreateStudentRequest {
  name: string;
  email: string;
  courseId: string;
}

interface CreateStudentResponse {
  student: Student;
}

@Injectable()
export class CreateStudent {
  constructor(
    @Inject("StudentsRepository")
    private readonly studentsRepository: StudentsRepository,

    @Inject("CoursesRepository")
    private readonly coursesRepository: CoursesRepository,
  ) {}

  async execute({
    name,
    email,
    courseId,
  }: CreateStudentRequest): Promise<CreateStudentResponse> {
    const studentExists = await this.studentsRepository.findByEmail(email);
    if (studentExists) {
      throw new StudentAlreadyExists();
    }

    const courseExists = await this.coursesRepository.findById(courseId);
    if (!courseExists) {
      throw new CourseNotFound();
    }

    const student = await this.studentsRepository.create({
      name,
      email,
      courseId,
    });

    return { student };
  }
}
