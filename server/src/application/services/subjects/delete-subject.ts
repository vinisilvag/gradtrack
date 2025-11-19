import { inject as Inject, injectable as Injectable } from "tsyringe";

import { SubjectsRepository } from "@/application/repositories/subjects-repository";

import { SubjectNotFound } from "@/application/errors/subjects/subject-not-found";

interface DeleteSubjectRequest {
  subjectId: string;
}

@Injectable()
export class DeleteSubject {
  constructor(
    @Inject("StudentsRepository")
    private readonly subjectsRepository: SubjectsRepository,
  ) {}

  async execute({ subjectId }: DeleteSubjectRequest): Promise<void> {
    const subject = await this.subjectsRepository.findById(subjectId);

    if (!subject) {
      throw new SubjectNotFound();
    }

    await this.subjectsRepository.delete(subjectId);
  }
}
