import type { NextFunction, Request, Response } from "express";
import { env } from "../config/env.js";
import { logger } from "../lib/logger.js";

export function errorHandler(
  error: unknown,
  _request: Request,
  response: Response,
  _next: NextFunction,
): void {
  const message = error instanceof Error ? error.message : "Unknown server error";

  logger.error("unhandled_request_error", {
    requestId: response.locals.requestId,
    error: message,
  });

  response.status(500).json({
    error: {
      code: "INTERNAL_SERVER_ERROR",
      message: env.NODE_ENV === "production" ? "An unexpected error occurred" : message,
      requestId: response.locals.requestId,
    },
  });
}
