import type { Request, Response } from "express";

export function notFound(request: Request, response: Response): void {
  response.status(404).json({
    error: {
      code: "ROUTE_NOT_FOUND",
      message: `No route exists for ${request.method} ${request.path}`,
      requestId: response.locals.requestId,
    },
  });
}
