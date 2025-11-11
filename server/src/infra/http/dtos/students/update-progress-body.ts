import { z } from "zod";

export const updateProgressBody = z.object({
  subjectId: z.uuid(),
  status: z.enum(["PENDING", "IN_PROGRESS", "APPROVED", "FAILED"]),
  grade: z.number(),
});
