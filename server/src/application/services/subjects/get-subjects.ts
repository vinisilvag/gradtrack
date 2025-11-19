import { inject as Inject, injectable as Injectable } from "tsyringe";
import { SubjectsRepository } from "@/application/repositories/subjects-repository";

import type { Subject } from "@prisma/client";

interface GetSubjectsResponse {
  subjects: Subject[];
}

@Injectable()
export class GetSubjects {
  constructor(
    @Inject("SubjectsRepository")
    private readonly subjectsRepository: SubjectsRepository,
  ) {}

  async execute(): Promise<GetSubjectsResponse> {
    const subjects = await this.subjectsRepository.findMany();
    return { subjects };
  }
}
