import { AppError } from "@/helpers/app-error";

export class SubjectNotFound extends AppError {
  constructor() {
    super(404, "Subject not found.");
  }
}
