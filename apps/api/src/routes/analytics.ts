import { Router, type Response } from "express";
import type { CandidateStatus } from "@recruiterai/contracts";
import { authenticate } from "../middleware/authenticate.js";
import { Candidate } from "../models/candidate.js";
import { CandidateMatch } from "../models/candidate-match.js";
import { Interview } from "../models/interview.js";
import { Job } from "../models/job.js";

function requestId(response: Response): string {
  return response.locals.requestId as string;
}

const funnelStages: CandidateStatus[] = [
  "APPLIED",
  "SCREENING",
  "INTERVIEW",
  "OFFER",
  "HIRED",
  "REJECTED",
];

export const analyticsRouter = Router();
analyticsRouter.use(authenticate);

analyticsRouter.get("/overview", async (_request, response) => {
  const ownerId = response.locals.auth.sub;
  const [jobs, candidates, matches, interviews] = await Promise.all([
    Job.find({ ownerId }).select("title status applicantCount").lean(),
    Candidate.find({ ownerId }).select("status").lean(),
    CandidateMatch.find({ ownerId }).select("score recommendation source").lean(),
    Interview.find({ ownerId }).select("status scheduledAt feedback").lean(),
  ]);
  const completedInterviews = interviews.filter((item) => item.status === "COMPLETED");
  const ratings = interviews
    .map((item) => item.feedback?.rating)
    .filter((rating): rating is number => typeof rating === "number");
  const now = Date.now();

  response.json({
    data: {
      generatedAt: new Date().toISOString(),
      overview: {
        totalJobs: jobs.length,
        activeJobs: jobs.filter((job) => job.status === "PUBLISHED").length,
        totalCandidates: candidates.length,
        hires: candidates.filter((candidate) => candidate.status === "HIRED").length,
        upcomingInterviews: interviews.filter(
          (item) => item.status === "SCHEDULED" && item.scheduledAt.getTime() >= now,
        ).length,
        averageMatchScore: matches.length
          ? Math.round(matches.reduce((total, match) => total + match.score, 0) / matches.length)
          : 0,
      },
      funnel: funnelStages.map((stage) => ({
        stage,
        count: candidates.filter((candidate) => candidate.status === stage).length,
      })),
      topJobs: jobs
        .sort((left, right) => right.applicantCount - left.applicantCount)
        .slice(0, 5)
        .map((job) => ({
          id: String(job._id),
          title: job.title,
          applicants: job.applicantCount,
        })),
      quality: {
        analyzedCandidates: matches.length,
        strongMatches: matches.filter((match) => match.recommendation === "STRONG_MATCH").length,
        geminiAnalyses: matches.filter((match) => match.source === "GEMINI").length,
        fallbackAnalyses: matches.filter((match) => match.source === "DETERMINISTIC").length,
      },
      interviews: {
        scheduled: interviews.length,
        completed: completedInterviews.length,
        feedbackSubmitted: ratings.length,
        averageRating: ratings.length
          ? Number(
              (ratings.reduce((total, rating) => total + rating, 0) / ratings.length).toFixed(1),
            )
          : 0,
      },
    },
    requestId: requestId(response),
  });
});
