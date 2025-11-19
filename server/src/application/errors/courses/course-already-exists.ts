import { AppError } from "@/helpers/app-error";

export class CourseAlreadyExists extends AppError {
  constructor() {
    super(409, "Course name already registered.");
  }
}
