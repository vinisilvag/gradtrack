import { ENV } from "@/config/env/app";

import { PrismaClient } from "@prisma/client";

export const prisma = new PrismaClient({
  log: ENV === "development" ? ["query", "info", "warn", "error"] : ["error"],
});
