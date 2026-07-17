import type { NextFunction, Request, Response } from "express";
import { env } from "../config/env.js";
import { logger } from "../lib/logger.js";
import { HttpError } from "../lib/http-error.js";

export function errorHandler(
  error: unknown,
  _request: Request,
  response: Response,
  _next: NextFunction,
): void {
  const message = error instanceof Error ? error.message : "Unknown server error";
  const status = error instanceof HttpError ? error.status : 500;
  const code = error instanceof HttpError ? error.code : "INTERNAL_SERVER_ERROR";

  logger[status >= 500 ? "error" : "warn"]("request_error", {
    requestId: response.locals.requestId,
    error: message,
  });

  response.status(status).json({
    error: {
      code,
      message:
        status >= 500 && env.NODE_ENV === "production" ? "An unexpected error occurred" : message,
      requestId: response.locals.requestId,
      ...(error instanceof HttpError && error.details ? { details: error.details } : {}),
    },
  });
}
