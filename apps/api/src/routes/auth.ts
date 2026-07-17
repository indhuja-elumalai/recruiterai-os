import { Router, type Request, type Response } from "express";
import { rateLimit } from "express-rate-limit";
import {
  loginRequestSchema,
  registerRequestSchema,
  developmentPasswordResetRequestSchema,
  type AuthUser,
  type DevelopmentPasswordResetRequest,
  type LoginRequest,
  type RegisterRequest,
} from "@recruiterai/contracts";
import { env } from "../config/env.js";
import { HttpError } from "../lib/http-error.js";
import { hashPassword, verifyPassword } from "../lib/password.js";
import { createAccessToken, createRefreshToken, verifyToken } from "../lib/tokens.js";
import { authenticate } from "../middleware/authenticate.js";
import { User } from "../models/user.js";

const REFRESH_COOKIE = "recruiterai_refresh";
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 20,
  standardHeaders: "draft-8",
  legacyHeaders: false,
});

function requestId(response: Response): string {
  return response.locals.requestId as string;
}

function parseBody<T>(
  schema: {
    safeParse(
      value: unknown,
    ): { success: true; data: T } | { success: false; error: { flatten(): unknown } };
  },
  value: unknown,
): T {
  const result = schema.safeParse(value);
  if (!result.success) {
    throw new HttpError(
      422,
      "VALIDATION_ERROR",
      "Please check the submitted fields",
      result.error.flatten(),
    );
  }
  return result.data;
}

function publicUser(user: {
  _id: { toString(): string };
  name: string;
  email: string;
  role: AuthUser["role"];
  organizationName: string;
}): AuthUser {
  return {
    id: user._id.toString(),
    name: user.name,
    email: user.email,
    role: user.role,
    organizationName: user.organizationName,
  };
}

function setRefreshCookie(response: Response, token: string): void {
  response.cookie(REFRESH_COOKIE, token, {
    httpOnly: true,
    secure: env.NODE_ENV === "production",
    sameSite: "lax",
    signed: true,
    path: "/api/v1/auth",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
}

async function issueSession(user: {
  _id: { toString(): string };
  role: string;
  tokenVersion: number;
}): Promise<{ accessToken: string; refreshToken: string }> {
  const id = user._id.toString();
  const [accessToken, refreshToken] = await Promise.all([
    createAccessToken(id, user.role, user.tokenVersion),
    createRefreshToken(id, user.role, user.tokenVersion),
  ]);
  return { accessToken, refreshToken };
}

export const authRouter = Router();

authRouter.post("/register", authLimiter, async (request, response) => {
  const input = parseBody<RegisterRequest>(registerRequestSchema, request.body);
  if (await User.exists({ email: input.email })) {
    throw new HttpError(
      409,
      "EMAIL_ALREADY_REGISTERED",
      "An account already exists for this email",
    );
  }

  const user = await User.create({
    name: input.name,
    email: input.email,
    passwordHash: await hashPassword(input.password),
    organizationName: input.organizationName,
    role: "ADMIN",
  });
  const session = await issueSession(user);
  setRefreshCookie(response, session.refreshToken);

  response.status(201).json({
    data: { user: publicUser(user), accessToken: session.accessToken },
    requestId: requestId(response),
  });
});

authRouter.post("/login", authLimiter, async (request, response) => {
  const input = parseBody<LoginRequest>(loginRequestSchema, request.body);
  const user = await User.findOne({ email: input.email }).select("+passwordHash");
  if (!user || !(await verifyPassword(input.password, user.passwordHash))) {
    throw new HttpError(401, "INVALID_CREDENTIALS", "Email or password is incorrect");
  }

  const session = await issueSession(user);
  setRefreshCookie(response, session.refreshToken);
  response.json({
    data: { user: publicUser(user), accessToken: session.accessToken },
    requestId: requestId(response),
  });
});

authRouter.post("/development/reset-password", authLimiter, async (request, response) => {
  if (env.NODE_ENV !== "development") {
    throw new HttpError(404, "RESET_NOT_AVAILABLE", "Password reset is not available");
  }

  const input = parseBody<DevelopmentPasswordResetRequest>(
    developmentPasswordResetRequestSchema,
    request.body,
  );
  const user = await User.findOneAndUpdate(
    { email: input.email },
    {
      $set: { passwordHash: await hashPassword(input.newPassword) },
      $inc: { tokenVersion: 1 },
    },
    { new: true },
  );

  if (!user) {
    throw new HttpError(404, "USER_NOT_FOUND", "No account exists for this email");
  }

  response.json({
    data: { message: "Password reset successfully. You can now log in." },
    requestId: requestId(response),
  });
});

authRouter.post("/refresh", async (request: Request, response) => {
  const token = request.signedCookies?.[REFRESH_COOKIE] as string | undefined;
  if (!token) throw new HttpError(401, "REFRESH_TOKEN_REQUIRED", "Please log in again");

  const claims = await verifyToken(token, "refresh");
  const user = await User.findOneAndUpdate(
    { _id: claims.sub, tokenVersion: claims.tokenVersion },
    { $inc: { tokenVersion: 1 } },
    { new: true },
  );
  if (!user) {
    throw new HttpError(401, "SESSION_REVOKED", "This session has been revoked");
  }

  const session = await issueSession(user);
  setRefreshCookie(response, session.refreshToken);
  response.json({
    data: { user: publicUser(user), accessToken: session.accessToken },
    requestId: requestId(response),
  });
});

authRouter.get("/me", authenticate, async (_request, response) => {
  const user = await User.findById(response.locals.auth.sub);
  if (!user) throw new HttpError(404, "USER_NOT_FOUND", "The authenticated user no longer exists");

  response.json({ data: { user: publicUser(user) }, requestId: requestId(response) });
});

authRouter.post("/logout", async (request, response) => {
  const token = request.signedCookies?.[REFRESH_COOKIE] as string | undefined;
  if (token) {
    try {
      const claims = await verifyToken(token, "refresh");
      await User.findByIdAndUpdate(claims.sub, { $inc: { tokenVersion: 1 } });
    } catch {
      // The cookie is cleared even when the submitted refresh token is stale.
    }
  }

  response.clearCookie(REFRESH_COOKIE, { path: "/api/v1/auth" });
  response.json({ data: { message: "Logged out successfully" }, requestId: requestId(response) });
});
