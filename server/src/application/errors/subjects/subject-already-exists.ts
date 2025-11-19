import { AppError } from "@/helpers/app-error";

export class SubjectAlreadyExists extends AppError {
  constructor() {
    super(409, "Subject code already registered.");
  }
}
