import { inject as Inject, injectable as Injectable } from "tsyringe";
import type { StudentsRepository } from "@/application/repositories/students-repository";
import { SubjectsRepository } from "@/application/repositories/subjects-repository";
import { ProgressRepository } from "@/application/repositories/progress-repository";

import { StudentNotFound } from "@/application/errors/students/student-not-found";
import { SubjectNotFound } from "@/application/errors/subjects/subject-not-found";

interface UpdateProgressRequest {
  studentId: string;
  subjectId: string;
  status: string;
  grade: number | undefined;
}

interface UpdateProgressResponse {
  update: any;
}

@Injectable()
export class UpdateProgress {
  constructor(
    @Inject("StudentsRepository")
    private readonly studentsRepository: StudentsRepository,

    @Inject("SubjectsRepository")
    private readonly subjectsRepository: SubjectsRepository,

    @Inject("ProgressRepository")
    private readonly progressRepository: ProgressRepository,
  ) {}

  async execute({
    studentId,
    subjectId,
    status,
    grade,
  }: UpdateProgressRequest): Promise<UpdateProgressResponse> {
    const student = await this.studentsRepository.findById(studentId);
    if (!student) {
      throw new StudentNotFound();
    }

    const subject = await this.subjectsRepository.findById(subjectId);
    if (!subject) {
      throw new SubjectNotFound();
    }

    const update = await this.progressRepository.updateOrInsertProgress({
      studentId,
      subjectId,
      status,
      grade,
    });

    return { update };
  }
}
