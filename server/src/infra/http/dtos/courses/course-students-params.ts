import { z } from "zod";

export const courseStudentsParams = z.object({
  courseId: z.uuid(),
});
