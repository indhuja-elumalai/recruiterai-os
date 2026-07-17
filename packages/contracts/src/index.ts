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

export const developmentPasswordResetRequestSchema = z.object({
  email: z.string().trim().toLowerCase().pipe(z.email()),
  newPassword: z.string().min(12).max(128),
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

export const jobStatusSchema = z.enum(["DRAFT", "PUBLISHED", "PAUSED", "CLOSED"]);
export const employmentTypeSchema = z.enum(["FULL_TIME", "PART_TIME", "CONTRACT", "INTERNSHIP"]);
export const workplaceTypeSchema = z.enum(["REMOTE", "HYBRID", "ON_SITE"]);

const jobFieldsSchema = z.object({
  title: z.string().trim().min(3).max(120),
  department: z.string().trim().min(2).max(80),
  location: z.string().trim().min(2).max(120),
  workplaceType: workplaceTypeSchema,
  employmentType: employmentTypeSchema,
  description: z.string().trim().min(30).max(10_000),
  skills: z.array(z.string().trim().min(1).max(50)).min(1).max(20),
  salaryMin: z.number().int().nonnegative().nullable(),
  salaryMax: z.number().int().nonnegative().nullable(),
  currency: z
    .string()
    .trim()
    .length(3)
    .transform((value) => value.toUpperCase()),
  status: jobStatusSchema,
});

export const createJobRequestSchema = jobFieldsSchema.superRefine((job, context) => {
  if (job.salaryMin !== null && job.salaryMax !== null && job.salaryMax < job.salaryMin) {
    context.addIssue({
      code: "custom",
      message: "Maximum salary must be greater than or equal to minimum salary",
      path: ["salaryMax"],
    });
  }
});

export const updateJobRequestSchema = jobFieldsSchema.partial().superRefine((job, context) => {
  if (
    job.salaryMin !== undefined &&
    job.salaryMax !== undefined &&
    job.salaryMin !== null &&
    job.salaryMax !== null &&
    job.salaryMax < job.salaryMin
  ) {
    context.addIssue({
      code: "custom",
      message: "Maximum salary must be greater than or equal to minimum salary",
      path: ["salaryMax"],
    });
  }
});

export const jobSchema = jobFieldsSchema.extend({
  id: z.string(),
  ownerId: z.string(),
  organizationName: z.string(),
  applicantCount: z.number().int().nonnegative(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export const jobResponseSchema = z.object({
  data: z.object({ job: jobSchema }),
  requestId: z.string(),
});

export const jobsResponseSchema = z.object({
  data: z.object({
    jobs: z.array(jobSchema),
    summary: z.object({
      total: z.number().int().nonnegative(),
      active: z.number().int().nonnegative(),
      drafts: z.number().int().nonnegative(),
      applicants: z.number().int().nonnegative(),
    }),
  }),
  requestId: z.string(),
});

export const candidateStatusSchema = z.enum([
  "APPLIED",
  "SCREENING",
  "INTERVIEW",
  "OFFER",
  "HIRED",
  "REJECTED",
]);

export const createCandidateRequestSchema = z.object({
  jobId: z.string().trim().min(1),
  name: z.string().trim().min(2).max(100),
  email: z.string().trim().toLowerCase().pipe(z.email()),
  phone: z.string().trim().min(7).max(24),
  location: z.string().trim().min(2).max(120),
  currentTitle: z.string().trim().min(2).max(120),
  yearsExperience: z.number().min(0).max(60),
  skills: z.array(z.string().trim().min(1).max(50)).min(1).max(30),
});

export const updateCandidateStatusRequestSchema = z.object({
  status: candidateStatusSchema,
});

export const candidateSchema = createCandidateRequestSchema.extend({
  id: z.string(),
  ownerId: z.string(),
  jobTitle: z.string(),
  status: candidateStatusSchema,
  resume: z.object({
    fileName: z.string(),
    mimeType: z.string(),
    extractedCharacters: z.number().int().nonnegative(),
    preview: z.string(),
  }),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export const candidateResponseSchema = z.object({
  data: z.object({ candidate: candidateSchema }),
  requestId: z.string(),
});

export const candidatesResponseSchema = z.object({
  data: z.object({
    candidates: z.array(candidateSchema),
    summary: z.object({
      total: z.number().int().nonnegative(),
      screening: z.number().int().nonnegative(),
      interviews: z.number().int().nonnegative(),
      hired: z.number().int().nonnegative(),
    }),
  }),
  requestId: z.string(),
});

export const matchSourceSchema = z.enum(["GEMINI", "DETERMINISTIC"]);
export const candidateMatchSchema = z.object({
  id: z.string(),
  candidateId: z.string(),
  jobId: z.string(),
  score: z.number().int().min(0).max(100),
  recommendation: z.enum(["STRONG_MATCH", "POTENTIAL_MATCH", "REVIEW_REQUIRED"]),
  strengths: z.array(z.string()),
  gaps: z.array(z.string()),
  summary: z.string(),
  rationale: z.string(),
  source: matchSourceSchema,
  model: z.string(),
  analyzedAt: z.string(),
});

export const candidateMatchResponseSchema = z.object({
  data: z.object({ match: candidateMatchSchema }),
  requestId: z.string(),
});

export const candidateMatchesResponseSchema = z.object({
  data: z.object({ matches: z.array(candidateMatchSchema) }),
  requestId: z.string(),
});

export type ApiError = z.infer<typeof apiErrorSchema>;
export type HealthResponse = z.infer<typeof healthResponseSchema>;
export type AuthUser = z.infer<typeof authUserSchema>;
export type RegisterRequest = z.infer<typeof registerRequestSchema>;
export type LoginRequest = z.infer<typeof loginRequestSchema>;
export type DevelopmentPasswordResetRequest = z.infer<typeof developmentPasswordResetRequestSchema>;
export type AuthResponse = z.infer<typeof authResponseSchema>;
export type CurrentUserResponse = z.infer<typeof currentUserResponseSchema>;
export type MessageResponse = z.infer<typeof messageResponseSchema>;
export type JobStatus = z.infer<typeof jobStatusSchema>;
export type EmploymentType = z.infer<typeof employmentTypeSchema>;
export type WorkplaceType = z.infer<typeof workplaceTypeSchema>;
export type CreateJobRequest = z.infer<typeof createJobRequestSchema>;
export type UpdateJobRequest = z.infer<typeof updateJobRequestSchema>;
export type Job = z.infer<typeof jobSchema>;
export type JobResponse = z.infer<typeof jobResponseSchema>;
export type JobsResponse = z.infer<typeof jobsResponseSchema>;
export type CandidateStatus = z.infer<typeof candidateStatusSchema>;
export type CreateCandidateRequest = z.infer<typeof createCandidateRequestSchema>;
export type UpdateCandidateStatusRequest = z.infer<typeof updateCandidateStatusRequestSchema>;
export type Candidate = z.infer<typeof candidateSchema>;
export type CandidateResponse = z.infer<typeof candidateResponseSchema>;
export type CandidatesResponse = z.infer<typeof candidatesResponseSchema>;
export type MatchSource = z.infer<typeof matchSourceSchema>;
export type CandidateMatch = z.infer<typeof candidateMatchSchema>;
export type CandidateMatchResponse = z.infer<typeof candidateMatchResponseSchema>;
export type CandidateMatchesResponse = z.infer<typeof candidateMatchesResponseSchema>;
