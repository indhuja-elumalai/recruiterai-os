import { Router } from "express";
import mongoose from "mongoose";
import type { HealthResponse } from "@recruiterai/contracts";
import { env } from "../config/env.js";

export const healthRouter = Router();

healthRouter.get("/", (_request, response) => {
  const database = !env.MONGODB_URI
    ? "not_configured"
    : mongoose.connection.readyState === 1
      ? "connected"
      : "disconnected";

  const body: HealthResponse = {
    data: {
      service: "recruiterai-api",
      status: database === "disconnected" ? "degraded" : "ok",
      database,
      timestamp: new Date().toISOString(),
      version: env.APP_VERSION,
    },
    requestId: response.locals.requestId as string,
  };

  response.status(body.data.status === "ok" ? 200 : 503).json(body);
});
