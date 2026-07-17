import { loadEnvironment } from "./load-env.js";
import { z } from "zod";

loadEnvironment();

const environmentSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  PORT: z.coerce.number().int().positive().default(4000),
  WEB_URL: z.url().default("http://localhost:5173"),
  MONGODB_URI: z.string().min(1).optional(),
  MONGODB_DB_NAME: z.string().min(1).default("recruiterai"),
  APP_VERSION: z.string().default("0.1.0"),
  JWT_ACCESS_SECRET: z.string().min(32).optional(),
  JWT_REFRESH_SECRET: z.string().min(32).optional(),
  COOKIE_SECRET: z.string().min(32).optional(),
  ACCESS_TOKEN_TTL: z.string().default("15m"),
  REFRESH_TOKEN_TTL: z.string().default("7d"),
  GEMINI_API_KEY: z
    .string()
    .trim()
    .optional()
    .transform((value) => value || undefined),
  GEMINI_MODEL: z
    .string()
    .trim()
    .default("gemini-3.1-flash-lite")
    .transform((value) => value || "gemini-3.1-flash-lite"),
  SEED_ORGANIZATION_NAME: z.string().trim().default("Ind Technologies"),
  SEED_ADMIN_EMAIL: z
    .string()
    .trim()
    .toLowerCase()
    .pipe(z.email())
    .default("admin@demo.recruiterai.dev"),
  SEED_CANDIDATE_EMAIL: z
    .string()
    .trim()
    .toLowerCase()
    .pipe(z.email())
    .default("candidate@demo.recruiterai.dev"),
  SEED_DEMO_PASSWORD: z
    .string()
    .optional()
    .transform((value) => value || undefined),
  RESEND_API_KEY: z
    .string()
    .trim()
    .optional()
    .transform((value) => value || undefined),
  EMAIL_FROM: z
    .string()
    .trim()
    .optional()
    .transform((value) => value || undefined),
});

const result = environmentSchema.safeParse(process.env);

if (!result.success) {
  const issues = result.error.issues.map((issue) => `${issue.path.join(".")}: ${issue.message}`);
  throw new Error(`Invalid environment configuration:\n${issues.join("\n")}`);
}

export const env = result.data;
