import { z } from "zod";

export const updateProgressParams = z.object({
  studentId: z.uuid(),
});
