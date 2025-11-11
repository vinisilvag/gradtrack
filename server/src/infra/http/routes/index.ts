import { Router } from "express";

import { studentRoutes } from "./student-routes";
import { courseRoutes } from "./course-routes";

const appRoutes = Router();

appRoutes.use("/students", studentRoutes);
appRoutes.use("/courses", courseRoutes);

export { appRoutes };
