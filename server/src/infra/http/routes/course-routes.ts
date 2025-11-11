import { Router } from "express";

import { CourseController } from "@/infra/http/controllers/course-controller";

const courseRoutes = Router();
const courseController = new CourseController();

courseRoutes.get("/", courseController.index);
courseRoutes.get("/:courseId/students", courseController.getCourseStudents);

export { courseRoutes };
