import { AppError } from "@/helpers/app-error";

export class CourseSubjectAlreadyExists extends AppError {
  constructor() {
    super(409, "Course-subject vinculation already registered.");
  }
}
