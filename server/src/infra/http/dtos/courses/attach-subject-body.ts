import { z } from "zod";

export const attachSubjectBody = z.object({
  courseId: z.uuid(),
  subjectId: z.uuid(),
  semester: z.int(),
});
