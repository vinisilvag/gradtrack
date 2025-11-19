import { inject as Inject, injectable as Injectable } from "tsyringe";
import type { StudentsRepository } from "@/application/repositories/students-repository";
import { StudentNotFound } from "@/application/errors/students/student-not-found";

interface DeleteStudentRequest {
  studentId: string;
}

@Injectable()
export class DeleteStudent {
  constructor(
    @Inject("StudentsRepository")
    private readonly studentsRepository: StudentsRepository,
  ) {}

  async execute({ studentId }: DeleteStudentRequest): Promise<void> {
    const student = await this.studentsRepository.findById(studentId);

    if (!student) {
      throw new StudentNotFound();
    }

    await this.studentsRepository.delete(studentId);
  }
}
