import { Router, type Response } from "express";
import mongoose from "mongoose";
import {
  createJobRequestSchema,
  updateJobRequestSchema,
  type CreateJobRequest,
  type Job as JobContract,
  type UpdateJobRequest,
} from "@recruiterai/contracts";
import { HttpError } from "../lib/http-error.js";
import { authenticate } from "../middleware/authenticate.js";
import { Job, type JobDocument } from "../models/job.js";
import { User } from "../models/user.js";

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
      "Please check the submitted job details",
      result.error.flatten(),
    );
  }
  return result.data;
}

function publicJob(job: JobDocument): JobContract {
  return {
    id: job._id.toString(),
    ownerId: job.ownerId.toString(),
    organizationName: job.organizationName,
    title: job.title,
    department: job.department,
    location: job.location,
    workplaceType: job.workplaceType,
    employmentType: job.employmentType,
    description: job.description,
    skills: job.skills,
    salaryMin: job.salaryMin ?? null,
    salaryMax: job.salaryMax ?? null,
    currency: job.currency,
    status: job.status,
    applicantCount: job.applicantCount,
    createdAt: job.createdAt.toISOString(),
    updatedAt: job.updatedAt.toISOString(),
  };
}

function validJobId(value: string): void {
  if (!mongoose.isValidObjectId(value)) {
    throw new HttpError(404, "JOB_NOT_FOUND", "Job not found");
  }
}

export const jobsRouter = Router();
jobsRouter.use(authenticate);

jobsRouter.get("/", async (_request, response) => {
  const ownerId = response.locals.auth.sub;
  const jobs = await Job.find({ ownerId }).sort({ updatedAt: -1 });
  const publicJobs = jobs.map((job) => publicJob(job as JobDocument));

  response.json({
    data: {
      jobs: publicJobs,
      summary: {
        total: publicJobs.length,
        active: publicJobs.filter((job) => job.status === "PUBLISHED").length,
        drafts: publicJobs.filter((job) => job.status === "DRAFT").length,
        applicants: publicJobs.reduce((total, job) => total + job.applicantCount, 0),
      },
    },
    requestId: requestId(response),
  });
});

jobsRouter.post("/", async (request, response) => {
  const input = parseBody<CreateJobRequest>(createJobRequestSchema, request.body);
  const ownerId = response.locals.auth.sub;
  const user = await User.findById(ownerId);
  if (!user) throw new HttpError(401, "USER_NOT_FOUND", "Please log in again");

  const job = await Job.create({
    ...input,
    ownerId,
    organizationName: user.organizationName,
  });

  response.status(201).json({
    data: { job: publicJob(job as JobDocument) },
    requestId: requestId(response),
  });
});

jobsRouter.patch("/:jobId", async (request, response) => {
  validJobId(request.params.jobId);
  const input = parseBody<UpdateJobRequest>(updateJobRequestSchema, request.body);
  if (Object.keys(input).length === 0) {
    throw new HttpError(422, "VALIDATION_ERROR", "Submit at least one job field to update");
  }

  if (input.salaryMin !== undefined || input.salaryMax !== undefined) {
    const currentJob = await Job.findOne({
      _id: request.params.jobId,
      ownerId: response.locals.auth.sub,
    });
    if (!currentJob) throw new HttpError(404, "JOB_NOT_FOUND", "Job not found");

    const salaryMin = input.salaryMin === undefined ? currentJob.salaryMin : input.salaryMin;
    const salaryMax = input.salaryMax === undefined ? currentJob.salaryMax : input.salaryMax;
    if (salaryMin !== null && salaryMax !== null && salaryMax < salaryMin) {
      throw new HttpError(
        422,
        "VALIDATION_ERROR",
        "Maximum salary must be greater than or equal to minimum salary",
      );
    }
  }

  const job = await Job.findOneAndUpdate(
    { _id: request.params.jobId, ownerId: response.locals.auth.sub },
    { $set: input },
    { new: true, runValidators: true },
  );
  if (!job) throw new HttpError(404, "JOB_NOT_FOUND", "Job not found");

  response.json({
    data: { job: publicJob(job as JobDocument) },
    requestId: requestId(response),
  });
});
