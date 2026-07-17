import cors from "cors";
import cookieParser from "cookie-parser";
import express from "express";
import helmet from "helmet";
import { env } from "./config/env.js";
import { errorHandler } from "./middleware/error-handler.js";
import { notFound } from "./middleware/not-found.js";
import { requestContext } from "./middleware/request-context.js";
import { healthRouter } from "./routes/health.js";
import { authRouter } from "./routes/auth.js";
import { jobsRouter } from "./routes/jobs.js";
import { candidatesRouter } from "./routes/candidates.js";
import { matchesRouter } from "./routes/matches.js";
import { interviewsRouter } from "./routes/interviews.js";
import { analyticsRouter } from "./routes/analytics.js";

export function createApp(): express.Express {
  const app = express();

  app.disable("x-powered-by");
  app.use(requestContext);
  app.use(helmet());
  app.use(
    cors({
      origin: env.WEB_URL,
      credentials: true,
    }),
  );
  app.use(express.json({ limit: "1mb" }));
  app.use(cookieParser(env.COOKIE_SECRET));

  app.use("/api/v1/health", healthRouter);
  app.use("/api/v1/auth", authRouter);
  app.use("/api/v1/jobs", jobsRouter);
  app.use("/api/v1/candidates", candidatesRouter);
  app.use("/api/v1/matches", matchesRouter);
  app.use("/api/v1/interviews", interviewsRouter);
  app.use("/api/v1/analytics", analyticsRouter);
  app.use(notFound);
  app.use(errorHandler);

  return app;
}
