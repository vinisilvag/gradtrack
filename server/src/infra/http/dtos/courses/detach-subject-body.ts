import { z } from "zod";

export const detachSubjectBody = z.object({
  courseId: z.uuid(),
  subjectId: z.uuid(),
});
