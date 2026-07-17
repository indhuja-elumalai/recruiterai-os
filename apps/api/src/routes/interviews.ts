import { Router, type Response } from "express";
import mongoose from "mongoose";
import {
  interviewFeedbackRequestSchema,
  scheduleInterviewRequestSchema,
  updateInterviewStatusRequestSchema,
  type Interview as InterviewContract,
  type InterviewFeedbackRequest,
  type ScheduleInterviewRequest,
  type InterviewStatus,
} from "@recruiterai/contracts";
import { HttpError } from "../lib/http-error.js";
import { generateInterviewQuestions } from "../lib/screening.js";
import { authenticate } from "../middleware/authenticate.js";
import { Candidate } from "../models/candidate.js";
import { Interview, type InterviewDocument } from "../models/interview.js";
import { Job } from "../models/job.js";

function requestId(response: Response): string {
  return response.locals.requestId as string;
}

function parseBody<T>(schema: { parse(value: unknown): T }, value: unknown): T {
  try {
    return schema.parse(value);
  } catch (error) {
    throw new HttpError(422, "VALIDATION_ERROR", "Please check the interview details", error);
  }
}

function validId(value: string): void {
  if (!mongoose.isValidObjectId(value)) {
    throw new HttpError(404, "INTERVIEW_NOT_FOUND", "Interview not found");
  }
}

function publicInterview(interview: InterviewDocument): InterviewContract {
  return {
    id: interview._id.toString(),
    ownerId: interview.ownerId.toString(),
    candidateId: interview.candidateId.toString(),
    jobId: interview.jobId.toString(),
    candidateName: interview.candidateName,
    jobTitle: interview.jobTitle,
    stage: interview.stage,
    scheduledAt: interview.scheduledAt.toISOString(),
    durationMinutes: interview.durationMinutes,
    timezone: interview.timezone,
    meetingUrl: interview.meetingUrl,
    notes: interview.notes,
    status: interview.status,
    calendarProvider: interview.calendarProvider,
    questions: interview.questions,
    feedback: interview.feedback
      ? {
          rating: interview.feedback.rating,
          recommendation: interview.feedback.recommendation,
          strengths: interview.feedback.strengths,
          concerns: interview.feedback.concerns,
          notes: interview.feedback.notes,
          submittedAt: interview.feedback.submittedAt.toISOString(),
        }
      : null,
    createdAt: interview.createdAt.toISOString(),
    updatedAt: interview.updatedAt.toISOString(),
  };
}

export const interviewsRouter = Router();
interviewsRouter.use(authenticate);

interviewsRouter.get("/", async (_request, response) => {
  const interviews = await Interview.find({ ownerId: response.locals.auth.sub }).sort({
    scheduledAt: 1,
  });
  const publicInterviews = interviews.map((item) => publicInterview(item as InterviewDocument));
  const now = Date.now();
  response.json({
    data: {
      interviews: publicInterviews,
      summary: {
        upcoming: publicInterviews.filter(
          (item) => item.status === "SCHEDULED" && new Date(item.scheduledAt).getTime() >= now,
        ).length,
        completed: publicInterviews.filter((item) => item.status === "COMPLETED").length,
        feedbackPending: publicInterviews.filter(
          (item) => item.status === "COMPLETED" && !item.feedback,
        ).length,
      },
    },
    requestId: requestId(response),
  });
});

interviewsRouter.post("/", async (request, response) => {
  const input = parseBody<ScheduleInterviewRequest>(scheduleInterviewRequestSchema, request.body);
  if (!mongoose.isValidObjectId(input.candidateId)) {
    throw new HttpError(404, "CANDIDATE_NOT_FOUND", "Candidate not found");
  }
  const candidate = await Candidate.findOne({
    _id: input.candidateId,
    ownerId: response.locals.auth.sub,
  });
  if (!candidate) throw new HttpError(404, "CANDIDATE_NOT_FOUND", "Candidate not found");
  const job = await Job.findOne({ _id: candidate.jobId, ownerId: response.locals.auth.sub });
  if (!job) throw new HttpError(404, "JOB_NOT_FOUND", "Assigned job not found");

  const interview = await Interview.create({
    ...input,
    ownerId: response.locals.auth.sub,
    jobId: job._id,
    candidateName: candidate.name,
    jobTitle: job.title,
    calendarProvider: "LOCAL",
    questions: generateInterviewQuestions({
      candidateName: candidate.name,
      currentTitle: candidate.currentTitle,
      jobTitle: job.title,
      jobSkills: job.skills,
      stage: input.stage,
    }),
  });
  if (candidate.status === "APPLIED" || candidate.status === "SCREENING") {
    await Candidate.findByIdAndUpdate(candidate._id, { $set: { status: "INTERVIEW" } });
  }

  response.status(201).json({
    data: { interview: publicInterview(interview as InterviewDocument) },
    requestId: requestId(response),
  });
});

interviewsRouter.patch("/:interviewId/status", async (request, response) => {
  validId(request.params.interviewId);
  const input = parseBody<{ status: InterviewStatus }>(
    updateInterviewStatusRequestSchema,
    request.body,
  );
  const interview = await Interview.findOneAndUpdate(
    { _id: request.params.interviewId, ownerId: response.locals.auth.sub },
    { $set: { status: input.status } },
    { new: true, runValidators: true },
  );
  if (!interview) throw new HttpError(404, "INTERVIEW_NOT_FOUND", "Interview not found");
  response.json({
    data: { interview: publicInterview(interview as InterviewDocument) },
    requestId: requestId(response),
  });
});

interviewsRouter.put("/:interviewId/feedback", async (request, response) => {
  validId(request.params.interviewId);
  const input = parseBody<InterviewFeedbackRequest>(interviewFeedbackRequestSchema, request.body);
  const interview = await Interview.findOneAndUpdate(
    { _id: request.params.interviewId, ownerId: response.locals.auth.sub },
    { $set: { feedback: { ...input, submittedAt: new Date() }, status: "COMPLETED" } },
    { new: true, runValidators: true },
  );
  if (!interview) throw new HttpError(404, "INTERVIEW_NOT_FOUND", "Interview not found");
  response.json({
    data: { interview: publicInterview(interview as InterviewDocument) },
    requestId: requestId(response),
  });
});
