import { ENV } from "@/config/env/app";
import { AppError } from "@/helpers/app-error";
import {
  type ErrorRequestHandler,
  type NextFunction,
  type Request,
  type Response,
} from "express";

import { ZodError } from "zod";

export async function errorHandler(
  err: ErrorRequestHandler,
  request: Request,
  response: Response,
  _: NextFunction,
): Promise<Response> {
  // if (ENV === "development") {
  //   console.log(err);
  // }

  if (err instanceof ZodError) {
    const errors = err.issues;
    return response.status(400).json({ message: "Validation fails", errors });
  }

  if (err instanceof AppError) {
    return response.status(err.statusCode ?? 500).json({
      status: "error",
      message: err.message,
    });
  }

  return response.status(500).json({
    status: "error",
    message: "Internal server error.",
  });
}
