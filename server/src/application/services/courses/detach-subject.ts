import { inject as Inject, injectable as Injectable } from "tsyringe";

import { CoursesRepository } from "@/application/repositories/courses-repository";
import { SubjectsRepository } from "@/application/repositories/subjects-repository";
import { CourseSubjectsRepository } from "@/application/repositories/course-subjects-repository";

import { CourseNotFound } from "@/application/errors/courses/course-not-found";
import { SubjectNotFound } from "@/application/errors/subjects/subject-not-found";
import { CourseSubjectNotFound } from "@/application/errors/course-subjects/course-subject-not-found";

interface DetachSubjectRequest {
  courseId: string;
  subjectId: string;
}

@Injectable()
export class DetachSubject {
  constructor(
    @Inject("CoursesRepository")
    private readonly coursesRepository: CoursesRepository,

    @Inject("SubjectsRepository")
    private readonly subjectsRepository: SubjectsRepository,

    @Inject("CourseSubjectsRepository")
    private readonly courseSubjectsRepository: CourseSubjectsRepository,
  ) {}

  async execute({ courseId, subjectId }: DetachSubjectRequest): Promise<void> {
    const course = await this.coursesRepository.findById(courseId);
    if (!course) {
      throw new CourseNotFound();
    }

    const subject = await this.subjectsRepository.findById(subjectId);
    if (!subject) {
      throw new SubjectNotFound();
    }

    const attachment =
      await this.courseSubjectsRepository.findByCourseAndSubject(
        courseId,
        subjectId,
      );
    if (!attachment) {
      throw new CourseSubjectNotFound();
    }

    await this.courseSubjectsRepository.delete(courseId, subjectId);
  }
}
