import { AppError } from "@/helpers/app-error";

export class StudentAlreadyExists extends AppError {
  constructor() {
    super(409, "Student email already registered.");
  }
}
