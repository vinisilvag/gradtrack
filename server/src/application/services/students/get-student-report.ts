import { inject as Inject, injectable as Injectable } from "tsyringe";
import type { StudentsRepository } from "@/application/repositories/students-repository";

import { StudentNotFound } from "@/application/errors/students/student-not-found";

import { ProgressStatus } from "@prisma/client";

interface GetStudentReportRequest {
  studentId: string;
}

type GetStudentReportResponse = any;

@Injectable()
export class GetStudentReport {
  constructor(
    @Inject("StudentsRepository")
    private readonly studentsRepository: StudentsRepository,
  ) {}

  async execute({
    studentId,
  }: GetStudentReportRequest): Promise<GetStudentReportResponse> {
    const student: any = await this.studentsRepository.findById(studentId);

    if (!student) {
      throw new StudentNotFound();
    }

    console.log("a");

    const approved = student.progress.filter(
      (p: { status: string }) => p.status === ProgressStatus.APPROVED,
    );
    const approvedHours = approved.reduce(
      (acc: any, p: { subject: { hours: any } }) => acc + p.subject.hours,
      0,
    );

    const categories = student.progress.reduce(
      (
        acc: any,
        p: { subject: { category: any; hours: any }; status: string },
      ) => {
        const k = p.subject.category;
        acc[k] ??= { done: 0, total: 0 };
        acc[k].total += p.subject.hours;
        if (p.status === ProgressStatus.APPROVED)
          acc[k].done += p.subject.hours;
        return acc;
      },
      {},
    );

    return {
      student: { id: student.id, name: student.name, email: student.email },
      course: {
        id: student.courseId,
        name: student.course.name,
        totalHours: student.course.totalHours,
      },
      approvedHours,
      remainingHours: Math.max(student.course.totalHours - approvedHours, 0),
      categories,
    };
  }
}
