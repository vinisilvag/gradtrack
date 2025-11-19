import type { Request, Response } from "express";

import { container } from "tsyringe";

import { GetCourses } from "@/application/services/courses/get-courses";
import { GetCourseStudents } from "@/application/services/courses/get-course-students";

import { CourseViewModel } from "@/infra/http/view-models/course-view-model";
import { StudentViewModel } from "../view-models/student-view-model";

import { courseStudentsParams } from "@/infra/http/dtos/courses/course-students-params";
import { createCourseBody } from "../dtos/courses/create-course-body";
import { CreateCourse } from "@/application/services/courses/create-course";
import { deleteCourseParams } from "../dtos/courses/delete-course-params";
import { DeleteCourse } from "@/application/services/courses/delete-course";
import { AttachSubject } from "@/application/services/courses/attach-subject";
import { detachSubjectBody } from "../dtos/courses/detach-subject-body";
import { DetachSubject } from "@/application/services/courses/detach-subject";
import { attachSubjectBody } from "../dtos/courses/attach-subject-body";

export class CourseController {
  public async index(_: Request, response: Response) {
    const getCourses = container.resolve(GetCourses);
    const { courses } = await getCourses.execute();

    return response.status(200).json({
      courses: courses.map((course) => CourseViewModel.toHTTP(course)),
    });
  }

  public async create(request: Request, response: Response) {
    const { name, totalHours } = createCourseBody.parse(request.body);

    const createCourse = container.resolve(CreateCourse);
    const { course } = await createCourse.execute({ name, totalHours });

    return response
      .status(201)
      .json({ course: CourseViewModel.toHTTP(course) });
  }

  public async getCourseStudents(request: Request, response: Response) {
    const { courseId } = courseStudentsParams.parse(request.params);

    const getCourseStudents = container.resolve(GetCourseStudents);
    const { students } = await getCourseStudents.execute({ courseId });

    return response.status(200).json({
      students: students.map((student) => StudentViewModel.toHTTP(student)),
    });
  }

  public async delete(request: Request, response: Response) {
    const { courseId } = deleteCourseParams.parse(request.params);

    const deleteCourse = container.resolve(DeleteCourse);
    await deleteCourse.execute({ courseId });

    return response.status(204).send();
  }

  public async attachSubject(request: Request, response: Response) {
    const { courseId, subjectId, semester } = attachSubjectBody.parse(
      request.body,
    );

    const attachSubject = container.resolve(AttachSubject);
    const {
      course,
      subject,
      semester: returnedSemester,
    } = await attachSubject.execute({
      courseId,
      subjectId,
      semester,
    });

    return response
      .status(200)
      .json({ course, subject, semester: returnedSemester });
  }

  public async detachSubject(request: Request, response: Response) {
    const { courseId, subjectId } = detachSubjectBody.parse(request.body);

    const detachSubject = container.resolve(DetachSubject);
    await detachSubject.execute({
      courseId,
      subjectId,
    });

    return response.status(204).send();
  }
}
