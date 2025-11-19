import { z } from "zod";

export const deleteCourseParams = z.object({
  courseId: z.uuid(),
});
