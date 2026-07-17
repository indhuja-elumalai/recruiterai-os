import { Router, type Response } from "express";
import mongoose from "mongoose";
import type { CandidateMatch as CandidateMatchContract } from "@recruiterai/contracts";
import { HttpError } from "../lib/http-error.js";
import { analyzeMatch } from "../lib/matching.js";
import { authenticate } from "../middleware/authenticate.js";
import { Candidate } from "../models/candidate.js";
import { CandidateMatch, type CandidateMatchDocument } from "../models/candidate-match.js";
import { Job } from "../models/job.js";

function requestId(response: Response): string {
  return response.locals.requestId as string;
}

function publicMatch(match: CandidateMatchDocument): CandidateMatchContract {
  return {
    id: match._id.toString(),
    candidateId: match.candidateId.toString(),
    jobId: match.jobId.toString(),
    score: match.score,
    recommendation: match.recommendation,
    strengths: match.strengths,
    gaps: match.gaps,
    summary: match.summary,
    rationale: match.rationale,
    source: match.source,
    model: match.model,
    analyzedAt: match.analyzedAt.toISOString(),
  };
}

export const matchesRouter = Router();
matchesRouter.use(authenticate);

matchesRouter.get("/", async (_request, response) => {
  const matches = await CandidateMatch.find({ ownerId: response.locals.auth.sub }).sort({
    analyzedAt: -1,
  });
  response.json({
    data: { matches: matches.map((match) => publicMatch(match as CandidateMatchDocument)) },
    requestId: requestId(response),
  });
});

matchesRouter.post("/candidates/:candidateId", async (request, response) => {
  if (!mongoose.isValidObjectId(request.params.candidateId)) {
    throw new HttpError(404, "CANDIDATE_NOT_FOUND", "Candidate not found");
  }
  const candidate = await Candidate.findOne({
    _id: request.params.candidateId,
    ownerId: response.locals.auth.sub,
  }).select("+resumeText");
  if (!candidate) throw new HttpError(404, "CANDIDATE_NOT_FOUND", "Candidate not found");
  const job = await Job.findOne({ _id: candidate.jobId, ownerId: response.locals.auth.sub });
  if (!job) throw new HttpError(404, "JOB_NOT_FOUND", "Assigned job not found");

  const analysis = await analyzeMatch({
    candidate: {
      name: candidate.name,
      currentTitle: candidate.currentTitle,
      yearsExperience: candidate.yearsExperience,
      skills: candidate.skills,
      resumeText: candidate.resumeText,
    },
    job: { title: job.title, description: job.description, skills: job.skills },
  });
  const match = await CandidateMatch.findOneAndUpdate(
    { ownerId: response.locals.auth.sub, candidateId: candidate._id },
    {
      $set: {
        jobId: job._id,
        ...analysis,
        analyzedAt: new Date(),
        promptVersion: "match-v1",
      },
    },
    { new: true, upsert: true, runValidators: true },
  );
  response.json({
    data: { match: publicMatch(match as CandidateMatchDocument) },
    requestId: requestId(response),
  });
});
