import { z } from "zod";

export const deleteSubjectParams = z.object({
  subjectId: z.uuid(),
});
