import { AppError } from "@/helpers/app-error";

export class CourseNotFound extends AppError {
  constructor() {
    super(404, "Course not found.");
  }
}
