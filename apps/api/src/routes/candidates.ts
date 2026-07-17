import { Router, type NextFunction, type Request, type Response } from "express";
import mongoose from "mongoose";
import multer from "multer";
import {
  createCandidateRequestSchema,
  updateCandidateStatusRequestSchema,
  type Candidate as CandidateContract,
  type CreateCandidateRequest,
  type UpdateCandidateStatusRequest,
} from "@recruiterai/contracts";
import { HttpError } from "../lib/http-error.js";
import { extractResumeText } from "../lib/resume.js";
import { authenticate } from "../middleware/authenticate.js";
import { Candidate, type CandidateDocument } from "../models/candidate.js";
import { Job } from "../models/job.js";

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 2 * 1024 * 1024, files: 1 },
  fileFilter: (_request, file, callback) => {
    const allowed = ["application/pdf", "text/plain"];
    callback(null, allowed.includes(file.mimetype));
  },
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
      "Please check the submitted candidate details",
      result.error.flatten(),
    );
  }
  return result.data;
}

function publicCandidate(candidate: CandidateDocument): CandidateContract {
  return {
    id: candidate._id.toString(),
    ownerId: candidate.ownerId.toString(),
    jobId: candidate.jobId.toString(),
    jobTitle: candidate.jobTitle,
    name: candidate.name,
    email: candidate.email,
    phone: candidate.phone,
    location: candidate.location,
    currentTitle: candidate.currentTitle,
    yearsExperience: candidate.yearsExperience,
    skills: candidate.skills,
    status: candidate.status,
    resume: {
      fileName: candidate.resumeFileName,
      mimeType: candidate.resumeMimeType,
      extractedCharacters: candidate.resumeCharacters,
      preview: candidate.resumePreview,
    },
    createdAt: candidate.createdAt.toISOString(),
    updatedAt: candidate.updatedAt.toISOString(),
  };
}

function resumeUpload(request: Request, response: Response, next: NextFunction): void {
  upload.single("resume")(request, response, (error) => {
    if (error instanceof multer.MulterError) {
      next(
        new HttpError(
          error.code === "LIMIT_FILE_SIZE" ? 413 : 422,
          "RESUME_UPLOAD_FAILED",
          error.code === "LIMIT_FILE_SIZE"
            ? "Resume files must be 2 MB or smaller"
            : "The resume upload could not be processed",
        ),
      );
      return;
    }
    if (error) {
      next(new HttpError(422, "RESUME_UPLOAD_FAILED", "The resume upload could not be processed"));
      return;
    }
    next();
  });
}

function validCandidateId(value: string): void {
  if (!mongoose.isValidObjectId(value)) {
    throw new HttpError(404, "CANDIDATE_NOT_FOUND", "Candidate not found");
  }
}

export const candidatesRouter = Router();
candidatesRouter.use(authenticate);

candidatesRouter.get("/", async (_request, response) => {
  const candidates = await Candidate.find({ ownerId: response.locals.auth.sub }).sort({
    updatedAt: -1,
  });
  const publicCandidates = candidates.map((candidate) =>
    publicCandidate(candidate as CandidateDocument),
  );

  response.json({
    data: {
      candidates: publicCandidates,
      summary: {
        total: publicCandidates.length,
        screening: publicCandidates.filter((candidate) => candidate.status === "SCREENING").length,
        interviews: publicCandidates.filter((candidate) => candidate.status === "INTERVIEW").length,
        hired: publicCandidates.filter((candidate) => candidate.status === "HIRED").length,
      },
    },
    requestId: requestId(response),
  });
});

candidatesRouter.post("/", resumeUpload, async (request, response) => {
  if (!request.file) {
    throw new HttpError(422, "RESUME_REQUIRED", "Attach a PDF or plain-text resume");
  }

  let submitted: unknown;
  try {
    submitted = JSON.parse(String(request.body.payload));
  } catch {
    throw new HttpError(422, "VALIDATION_ERROR", "Candidate details must be valid JSON");
  }
  const input = parseBody<CreateCandidateRequest>(createCandidateRequestSchema, submitted);
  if (!mongoose.isValidObjectId(input.jobId)) {
    throw new HttpError(404, "JOB_NOT_FOUND", "Job not found");
  }

  const job = await Job.findOne({ _id: input.jobId, ownerId: response.locals.auth.sub });
  if (!job) throw new HttpError(404, "JOB_NOT_FOUND", "Job not found");
  const resumeText = await extractResumeText(request.file);

  try {
    const candidate = await Candidate.create({
      ...input,
      ownerId: response.locals.auth.sub,
      jobTitle: job.title,
      resumeFileName: request.file.originalname,
      resumeMimeType: request.file.mimetype,
      resumeText,
      resumeCharacters: resumeText.length,
      resumePreview: resumeText.slice(0, 260),
    });
    await Job.findByIdAndUpdate(job._id, { $inc: { applicantCount: 1 } });

    response.status(201).json({
      data: { candidate: publicCandidate(candidate as CandidateDocument) },
      requestId: requestId(response),
    });
  } catch (error) {
    if (error && typeof error === "object" && "code" in error && error.code === 11000) {
      throw new HttpError(
        409,
        "CANDIDATE_ALREADY_EXISTS",
        "This candidate is already assigned to the selected job",
      );
    }
    throw error;
  }
});

candidatesRouter.patch("/:candidateId/status", async (request, response) => {
  validCandidateId(request.params.candidateId);
  const input = parseBody<UpdateCandidateStatusRequest>(
    updateCandidateStatusRequestSchema,
    request.body,
  );
  const candidate = await Candidate.findOneAndUpdate(
    { _id: request.params.candidateId, ownerId: response.locals.auth.sub },
    { $set: { status: input.status } },
    { new: true, runValidators: true },
  );
  if (!candidate) throw new HttpError(404, "CANDIDATE_NOT_FOUND", "Candidate not found");

  response.json({
    data: { candidate: publicCandidate(candidate as CandidateDocument) },
    requestId: requestId(response),
  });
});
