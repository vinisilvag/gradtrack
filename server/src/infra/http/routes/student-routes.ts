import { Router } from "express";

import { StudentController } from "@/infra/http/controllers/student-controller";

const studentRoutes = Router();
const studentController = new StudentController();

studentRoutes.get("/", studentController.index);
studentRoutes.post("/", studentController.create);
studentRoutes.patch("/:studentId/progress", studentController.updateProgress);
studentRoutes.get("/:studentId/report", studentController.report);

export { studentRoutes };
