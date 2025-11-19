import { z } from "zod";

export const createCourseBody = z.object({
  name: z.string(),
  totalHours: z.int(),
});
