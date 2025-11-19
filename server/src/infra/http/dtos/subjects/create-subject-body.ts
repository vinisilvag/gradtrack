import { z } from "zod";

export const createSubjectBody = z.object({
  code: z.string(),
  name: z.string(),
  hours: z.int(),
  category: z.enum(["MANDATORY", "OPTIONAL", "COMPLEMENTARY"]),
});
