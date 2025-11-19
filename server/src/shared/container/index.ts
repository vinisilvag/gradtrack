import { container } from "tsyringe";

import { type StudentsRepository } from "@/application/repositories/students-repository";
import { PrismaStudentsRepository } from "@/infra/database/prisma/repositories/prisma-students-repository";

import { CoursesRepository } from "@/application/repositories/courses-repository";
import { PrismaCoursesRepository } from "@/infra/database/prisma/repositories/prisma-courses-repository";

import { SubjectsRepository } from "@/application/repositories/subjects-repository";
import { PrismaSubjectsRepository } from "@/infra/database/prisma/repositories/prisma-subjects-repository";

import { ProgressRepository } from "@/application/repositories/progress-repository";
import { PrismaProgressRepository } from "@/infra/database/prisma/repositories/prisma-progress-repository";

import { CourseSubjectsRepository } from "@/application/repositories/course-subjects-repository";
import { PrismaCourseSubjectsRepository } from "@/infra/database/prisma/repositories/prisma-course-subjects-repository";

// repositories
container.registerSingleton<StudentsRepository>(
  "StudentsRepository",
  PrismaStudentsRepository,
);

container.registerSingleton<CoursesRepository>(
  "CoursesRepository",
  PrismaCoursesRepository,
);

container.registerSingleton<SubjectsRepository>(
  "SubjectsRepository",
  PrismaSubjectsRepository,
);

container.registerSingleton<ProgressRepository>(
  "ProgressRepository",
  PrismaProgressRepository,
);

container.registerSingleton<CourseSubjectsRepository>(
  "CourseSubjectsRepository",
  PrismaCourseSubjectsRepository,
);
