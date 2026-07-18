import cors from "cors";
import cookieParser from "cookie-parser";
import express from "express";
import helmet from "helmet";
import path from "node:path";
import { fileURLToPath } from "node:url";
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
  const webDistPath = fileURLToPath(new URL("../../web/dist", import.meta.url));

  app.disable("x-powered-by");
  app.use(requestContext);
  app.use(
    helmet({
      contentSecurityPolicy: {
        directives: {
          defaultSrc: ["'self'"],
          baseUri: ["'self'"],
          fontSrc: ["'self'", "data:", "https://fonts.gstatic.com"],
          formAction: ["'self'"],
          frameAncestors: ["'none'"],
          imgSrc: ["'self'", "data:", "https://images.unsplash.com", "https://i.pravatar.cc"],
          objectSrc: ["'none'"],
          scriptSrc: ["'self'"],
          styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
        },
      },
    }),
  );
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

  if (env.NODE_ENV === "production") {
    app.use(express.static(webDistPath, { index: false, maxAge: "1h" }));
    app.get(/^(?!\/api(?:\/|$)).*/, (_request, response) => {
      response.sendFile(path.join(webDistPath, "index.html"));
    });
  }

  app.use(notFound);
  app.use(errorHandler);

  return app;
}
