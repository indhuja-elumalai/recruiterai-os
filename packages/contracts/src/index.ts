import { z } from "zod";

export const apiErrorSchema = z.object({
  error: z.object({
    code: z.string(),
    message: z.string(),
    requestId: z.string(),
    details: z.unknown().optional(),
  }),
});

export const healthResponseSchema = z.object({
  data: z.object({
    service: z.literal("recruiterai-api"),
    status: z.enum(["ok", "degraded"]),
    database: z.enum(["connected", "disconnected", "not_configured"]),
    timestamp: z.iso.datetime(),
    version: z.string(),
  }),
  requestId: z.string(),
});

export const userRoleSchema = z.enum(["ADMIN", "RECRUITER", "MANAGER", "INTERVIEWER", "CANDIDATE"]);

export const authUserSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.email(),
  role: userRoleSchema,
  organizationName: z.string(),
});

export const registerRequestSchema = z.object({
  name: z.string().trim().min(2).max(80),
  email: z.string().trim().toLowerCase().pipe(z.email()),
  password: z.string().min(12).max(128),
  organizationName: z.string().trim().min(2).max(120),
});

export const loginRequestSchema = z.object({
  email: z.string().trim().toLowerCase().pipe(z.email()),
  password: z.string().min(1).max(128),
});

export const authResponseSchema = z.object({
  data: z.object({
    user: authUserSchema,
    accessToken: z.string(),
  }),
  requestId: z.string(),
});

export const currentUserResponseSchema = z.object({
  data: z.object({ user: authUserSchema }),
  requestId: z.string(),
});

export const messageResponseSchema = z.object({
  data: z.object({ message: z.string() }),
  requestId: z.string(),
});

export type ApiError = z.infer<typeof apiErrorSchema>;
export type HealthResponse = z.infer<typeof healthResponseSchema>;
export type AuthUser = z.infer<typeof authUserSchema>;
export type RegisterRequest = z.infer<typeof registerRequestSchema>;
export type LoginRequest = z.infer<typeof loginRequestSchema>;
export type AuthResponse = z.infer<typeof authResponseSchema>;
export type CurrentUserResponse = z.infer<typeof currentUserResponseSchema>;
export type MessageResponse = z.infer<typeof messageResponseSchema>;
