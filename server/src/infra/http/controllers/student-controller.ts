import type { Request, Response } from "express";

import { container } from "tsyringe";

import { StudentViewModel } from "@/infra/http/view-models/student-view-model";

import { CreateStudent } from "@/application/services/students/create-student";
import { createStudentBody } from "@/infra/http/dtos/students/create-student-body";

import { UpdateProgress } from "@/application/services/students/update-progress";
import { updateProgressBody } from "@/infra/http/dtos/students/update-progress-body";
import { updateProgressParams } from "@/infra/http/dtos/students/update-progress-params";

import { GetStudentReport } from "@/application/services/students/get-student-report";

import { studentReportParams } from "@/infra/http/dtos/students/student-report-params";
import { deleteStudentParams } from "@/infra/http/dtos/students/delete-student-params";

import { GetStudents } from "@/application/services/students/get-students";
import { DeleteStudent } from "@/application/services/students/delete-student";

export class StudentController {
  public async index(_: Request, response: Response) {
    const getStudents = container.resolve(GetStudents);
    const { students } = await getStudents.execute();

    return response.status(200).json({
      students: students.map((student) => StudentViewModel.toHTTP(student)),
    });
  }

  public async create(request: Request, response: Response) {
    const { name, email, courseId } = createStudentBody.parse(request.body);

    const createStudent = container.resolve(CreateStudent);
    const { student } = await createStudent.execute({ name, email, courseId });

    return response
      .status(201)
      .json({ student: StudentViewModel.toHTTP(student) });
  }

  public async report(request: Request, response: Response) {
    const { studentId } = studentReportParams.parse(request.params);

    const getStudentReport = container.resolve(GetStudentReport);
    const report = await getStudentReport.execute({
      studentId,
    });

    return response.status(200).json(report);
  }

  public async updateProgress(request: Request, response: Response) {
    const { studentId } = updateProgressParams.parse(request.params);
    const { subjectId, status, grade } = updateProgressBody.parse(request.body);

    const updateProgress = container.resolve(UpdateProgress);
    const { update } = await updateProgress.execute({
      studentId,
      subjectId,
      status,
      grade,
    });

    return response
      .status(200)
      .json({ update: StudentViewModel.toHTTP(update) });
  }

  public async delete(request: Request, response: Response) {
    const { studentId } = deleteStudentParams.parse(request.params);

    const deleteStudent = container.resolve(DeleteStudent);
    await deleteStudent.execute({ studentId });

    return response.status(204).send();
  }
}
