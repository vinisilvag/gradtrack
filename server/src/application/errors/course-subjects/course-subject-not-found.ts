import { AppError } from "@/helpers/app-error";

export class CourseSubjectNotFound extends AppError {
  constructor() {
    super(404, "Course-subject attachment not found.");
  }
}
