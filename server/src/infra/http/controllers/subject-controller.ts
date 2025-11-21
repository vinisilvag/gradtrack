import type { Request, Response } from "express";

import { container } from "tsyringe";

import { GetSubjects } from "@/application/services/subjects/get-subjects";
import { createSubjectBody } from "../dtos/subjects/create-subject-body";
import { CreateSubject } from "@/application/services/subjects/create-subject";
import { deleteSubjectParams } from "../dtos/subjects/delete-subject-params";
import { DeleteSubject } from "@/application/services/subjects/delete-subject";

export class SubjectController {
  public async index(_: Request, response: Response) {
    const getSubjects = container.resolve(GetSubjects);
    const { subjects } = await getSubjects.execute();

    return response.status(200).json({
      subjects,
    });
  }

  public async create(request: Request, response: Response) {
    const { code, name, hours, category } = createSubjectBody.parse(
      request.body,
    );

    const createSubject = container.resolve(CreateSubject);
    const { subject } = await createSubject.execute({
      code,
      name,
      hours,
      category,
    });

    return response.status(201).json({ subject });
  }

  public async delete(request: Request, response: Response) {
    const { subjectId } = deleteSubjectParams.parse(request.params);

    const deleteSubject = container.resolve(DeleteSubject);
    await deleteSubject.execute({ subjectId });

    return response.status(204).send();
  }
}
