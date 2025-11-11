import "express-async-errors";
import "reflect-metadata";

import "@/shared/container";

import express from "express";
import cors from "cors";

import { appRoutes } from "@/infra/http/routes";
import { errorHandler } from "@/infra/http/middlewares/error-handler";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api", appRoutes);
app.use(errorHandler);

export { app };
