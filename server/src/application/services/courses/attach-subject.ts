import { inject as Inject, injectable as Injectable } from "tsyringe";

import { CoursesRepository } from "@/application/repositories/courses-repository";
import { SubjectsRepository } from "@/application/repositories/subjects-repository";
import { CourseSubjectsRepository } from "@/application/repositories/course-subjects-repository";

import { CourseNotFound } from "@/application/errors/courses/course-not-found";
import { SubjectNotFound } from "@/application/errors/subjects/subject-not-found";
import { CourseSubjectAlreadyExists } from "@/application/errors/course-subjects/course-subject-already-exists";

interface AttachSubjectRequest {
  courseId: string;
  subjectId: string;
  semester: number;
}

type AttachSubjectResponse = any;

@Injectable()
export class AttachSubject {
  constructor(
    @Inject("CoursesRepository")
    private readonly coursesRepository: CoursesRepository,

    @Inject("SubjectsRepository")
    private readonly subjectsRepository: SubjectsRepository,

    @Inject("CourseSubjectsRepository")
    private readonly courseSubjectsRepository: CourseSubjectsRepository,
  ) {}

  async execute({
    courseId,
    subjectId,
    semester,
  }: AttachSubjectRequest): Promise<AttachSubjectResponse> {
    const course = await this.coursesRepository.findById(courseId);
    if (!course) {
      throw new CourseNotFound();
    }

    const subject = await this.subjectsRepository.findById(subjectId);
    if (!subject) {
      throw new SubjectNotFound();
    }

    const vinculationAlreadyExists =
      await this.courseSubjectsRepository.findByCourseAndSubject(
        courseId,
        subjectId,
      );
    if (vinculationAlreadyExists) {
      throw new CourseSubjectAlreadyExists();
    }

    await this.courseSubjectsRepository.create({
      courseId,
      subjectId,
      semester,
    });

    return { course, subject, semester };
  }
}
