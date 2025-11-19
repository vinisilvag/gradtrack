import { inject as Inject, injectable as Injectable } from "tsyringe";
import { SubjectsRepository } from "@/application/repositories/subjects-repository";

import type { Subject } from "@prisma/client";

import { SubjectAlreadyExists } from "@/application/errors/subjects/subject-already-exists";

interface CreateSubjectRequest {
  code: string;
  name: string;
  hours: number;
  category: string;
}

interface CreateSubjectResponse {
  subject: Subject;
}

@Injectable()
export class CreateSubject {
  constructor(
    @Inject("SubjectsRepository")
    private readonly subjectsRepository: SubjectsRepository,
  ) {}

  async execute({
    code,
    name,
    hours,
    category,
  }: CreateSubjectRequest): Promise<CreateSubjectResponse> {
    const subjectExists = await this.subjectsRepository.findByCode(code);
    if (subjectExists) {
      throw new SubjectAlreadyExists();
    }

    const subject = await this.subjectsRepository.create({
      code,
      name,
      hours,
      category,
    });

    return { subject };
  }
}
