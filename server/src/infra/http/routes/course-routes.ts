import { Router } from "express";

import { CourseController } from "@/infra/http/controllers/course-controller";

const courseRoutes = Router();
const courseController = new CourseController();

courseRoutes.get("/", courseController.index);
courseRoutes.post("/", courseController.create);
courseRoutes.get("/:courseId/students", courseController.getCourseStudents);
courseRoutes.delete("/:courseId", courseController.delete);
courseRoutes.patch("/subject/attach", courseController.attachSubject);
courseRoutes.patch("/subject/detach", courseController.detachSubject);

export { courseRoutes };
