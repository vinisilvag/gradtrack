import { z } from "zod";

export const deleteStudentParams = z.object({
  studentId: z.uuid(),
});
