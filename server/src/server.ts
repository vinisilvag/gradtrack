import { PORT } from "@/config/env/app";
import { app } from "./app";

app.get("/health", (_, response) => {
  return response.status(200).json({ ok: "ok" });
});

app.listen(PORT, () => {
  console.log(`🚀 HTTP server running on port ${PORT}`);
});
