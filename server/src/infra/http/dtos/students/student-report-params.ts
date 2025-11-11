import { z } from "zod";

export const studentReportParams = z.object({
  studentId: z.uuid(),
});
