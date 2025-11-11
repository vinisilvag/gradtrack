import { z } from "zod";

export const createStudentBody = z.object({
  name: z.string(),
  email: z.email(),
  courseId: z.uuid(),
});
