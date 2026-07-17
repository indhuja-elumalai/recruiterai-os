import type { NextFunction, Request, Response } from "express";
import { HttpError } from "../lib/http-error.js";
import { verifyToken } from "../lib/tokens.js";

export async function authenticate(
  request: Request,
  response: Response,
  next: NextFunction,
): Promise<void> {
  const authorization = request.header("authorization");
  if (!authorization?.startsWith("Bearer ")) {
    throw new HttpError(401, "AUTHENTICATION_REQUIRED", "Please log in to continue");
  }

  response.locals.auth = await verifyToken(authorization.slice(7), "access");
  next();
}
