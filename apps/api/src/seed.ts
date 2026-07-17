import { connectDatabase, disconnectDatabase } from "./config/database.js";
import { env } from "./config/env.js";
import { deterministicMatch } from "./lib/matching.js";
import { hashPassword } from "./lib/password.js";
import { generateInterviewQuestions } from "./lib/screening.js";
import { Candidate } from "./models/candidate.js";
import { CandidateMatch } from "./models/candidate-match.js";
import { Interview } from "./models/interview.js";
import { Job } from "./models/job.js";
import { User } from "./models/user.js";

async function seed(): Promise<void> {
  if (!env.SEED_DEMO_PASSWORD || env.SEED_DEMO_PASSWORD.length < 12) {
    throw new Error("SEED_DEMO_PASSWORD must contain at least 12 characters");
  }
  await connectDatabase();

  const user = await User.findOneAndUpdate(
    { email: env.SEED_ADMIN_EMAIL },
    {
      $set: {
        name: "Demo Administrator",
        organizationName: env.SEED_ORGANIZATION_NAME,
        role: "ADMIN",
        passwordHash: await hashPassword(env.SEED_DEMO_PASSWORD),
      },
      $setOnInsert: { tokenVersion: 0 },
    },
    { new: true, upsert: true, runValidators: true },
  );

  const job = await Job.findOneAndUpdate(
    { ownerId: user._id, title: "Senior AI Engineer" },
    {
      $set: {
        organizationName: user.organizationName,
        department: "AI Engineering",
        location: "Bengaluru",
        workplaceType: "HYBRID",
        employmentType: "FULL_TIME",
        description:
          "Build explainable AI matching, retrieval systems, evaluation pipelines, and production APIs for recruitment teams.",
        skills: ["Python", "TypeScript", "RAG", "MongoDB"],
        salaryMin: 1_800_000,
        salaryMax: 2_800_000,
        currency: "INR",
        status: "PUBLISHED",
        applicantCount: 1,
      },
    },
    { new: true, upsert: true, runValidators: true },
  );

  const resumeText =
    "AI engineer with four years of experience building Python and TypeScript services, retrieval augmented generation workflows, MongoDB applications, model evaluation, and explainable ranking systems.";
  const candidate = await Candidate.findOneAndUpdate(
    { ownerId: user._id, jobId: job._id, email: env.SEED_CANDIDATE_EMAIL },
    {
      $set: {
        jobTitle: job.title,
        name: "Ananya Rao",
        phone: "+91 98765 43210",
        location: "Bengaluru",
        currentTitle: "Machine Learning Engineer",
        yearsExperience: 4,
        skills: ["Python", "TypeScript", "RAG", "MongoDB"],
        status: "INTERVIEW",
        resumeFileName: "ananya-rao-resume.txt",
        resumeMimeType: "text/plain",
        resumeText,
        resumeCharacters: resumeText.length,
        resumePreview: resumeText.slice(0, 260),
      },
    },
    { new: true, upsert: true, runValidators: true },
  );

  const analysis = deterministicMatch({
    candidate: {
      name: candidate.name,
      currentTitle: candidate.currentTitle,
      yearsExperience: candidate.yearsExperience,
      skills: candidate.skills,
      resumeText,
    },
    job: { title: job.title, description: job.description, skills: job.skills },
  });
  await CandidateMatch.findOneAndUpdate(
    { ownerId: user._id, candidateId: candidate._id },
    { $set: { jobId: job._id, ...analysis, promptVersion: "match-v1", analyzedAt: new Date() } },
    { upsert: true, runValidators: true },
  );

  await Interview.findOneAndUpdate(
    { ownerId: user._id, candidateId: candidate._id, stage: "TECHNICAL" },
    {
      $set: {
        jobId: job._id,
        candidateName: candidate.name,
        jobTitle: job.title,
        scheduledAt: new Date(Date.now() + 24 * 60 * 60 * 1_000),
        durationMinutes: 60,
        timezone: "Asia/Kolkata",
        meetingUrl: "",
        notes: "Demo technical interview",
        status: "SCHEDULED",
        calendarProvider: "LOCAL",
        notificationStatus: "SKIPPED",
        questions: generateInterviewQuestions({
          candidateName: candidate.name,
          currentTitle: candidate.currentTitle,
          jobTitle: job.title,
          jobSkills: job.skills,
          stage: "TECHNICAL",
        }),
      },
    },
    { upsert: true, runValidators: true },
  );

  console.log(
    JSON.stringify({
      seeded: true,
      adminEmail: env.SEED_ADMIN_EMAIL,
      organization: env.SEED_ORGANIZATION_NAME,
    }),
  );
}

seed()
  .catch((error: unknown) => {
    console.error(error instanceof Error ? error.message : "Seed failed");
    process.exitCode = 1;
  })
  .finally(async () => {
    await disconnectDatabase();
  });
