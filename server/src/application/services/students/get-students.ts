import { inject as Inject, injectable as Injectable } from "tsyringe";
import type { StudentsRepository } from "@/application/repositories/students-repository";

import type { Student } from "@prisma/client";

interface GetStudentsResponse {
  students: Student[];
}

@Injectable()
export class GetStudents {
  constructor(
    @Inject("StudentsRepository")
    private readonly studentsRepository: StudentsRepository,
  ) {}

  async execute(): Promise<GetStudentsResponse> {
    const students = await this.studentsRepository.findMany();

    return { students };
  }
}
