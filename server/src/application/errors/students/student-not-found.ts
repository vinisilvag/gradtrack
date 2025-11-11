import { AppError } from "@/helpers/app-error";

export class StudentNotFound extends AppError {
  constructor() {
    super(404, "Student not found.");
  }
}
