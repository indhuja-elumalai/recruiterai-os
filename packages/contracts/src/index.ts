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

export type ApiError = z.infer<typeof apiErrorSchema>;
export type HealthResponse = z.infer<typeof healthResponseSchema>;
