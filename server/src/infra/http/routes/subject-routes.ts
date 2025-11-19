import { Router } from "express";

import { SubjectController } from "@/infra/http/controllers/subject-controller";

const subjectRoutes = Router();
const subjectController = new SubjectController();

subjectRoutes.get("/", subjectController.index);
subjectRoutes.post("/", subjectController.create);
subjectRoutes.delete("/:subjectId", subjectController.delete);

export { subjectRoutes };
