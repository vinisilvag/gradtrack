import type { Request, Response } from "express";

import { container } from "tsyringe";

import { GetCourses } from "@/application/services/courses/get-courses";
import { GetCourseStudents } from "@/application/services/courses/get-course-studenets";

import { CourseViewModel } from "@/infra/http/view-models/course-view-model";
import { StudentViewModel } from "../view-models/student-view-model";

import { courseStudentsParams } from "@/infra/http/dtos/courses/course-students-params";

export class CourseController {
  public async index(_: Request, response: Response) {
    const getCourses = container.resolve(GetCourses);
    const { courses } = await getCourses.execute();

    return response.status(200).json({
      courses: courses.map((course) => CourseViewModel.toHTTP(course)),
    });
  }

  public async getCourseStudents(request: Request, response: Response) {
    const { courseId } = courseStudentsParams.parse(request.body);

    const getCourseStudents = container.resolve(GetCourseStudents);
    const { students } = await getCourseStudents.execute({ courseId });

    return response.status(200).json({
      students: students.map((student) => StudentViewModel.toHTTP(student)),
    });
  }

  public async getCourseSubjects(request: Request, response: Response) {}
}
