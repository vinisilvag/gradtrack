import { Router } from "express";

import { studentRoutes } from "./student-routes";
import { courseRoutes } from "./course-routes";
import { subjectRoutes } from "./subject-routes";

const appRoutes = Router();

appRoutes.use("/students", studentRoutes);
appRoutes.use("/courses", courseRoutes);
appRoutes.use("/subjects", subjectRoutes);

export { appRoutes };
