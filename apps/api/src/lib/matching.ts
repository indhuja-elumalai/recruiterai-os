import { z } from "zod";
import { env } from "../config/env.js";

const matchAnalysisSchema = z.object({
  score: z.number().int().min(0).max(100),
  recommendation: z.enum(["STRONG_MATCH", "POTENTIAL_MATCH", "REVIEW_REQUIRED"]),
  strengths: z.array(z.string().min(1)).max(6),
  gaps: z.array(z.string().min(1)).max(6),
  summary: z.string().min(20).max(600),
  rationale: z.string().min(20).max(1_000),
});

export type MatchAnalysis = z.infer<typeof matchAnalysisSchema> & {
  source: "GEMINI" | "DETERMINISTIC";
  model: string;
};

interface MatchInput {
  candidate: {
    name: string;
    currentTitle: string;
    yearsExperience: number;
    skills: string[];
    resumeText: string;
  };
  job: { title: string; description: string; skills: string[] };
}

const stopwords = new Set([
  "and",
  "the",
  "with",
  "for",
  "that",
  "this",
  "from",
  "will",
  "your",
  "our",
  "are",
  "you",
  "job",
  "role",
]);

function normalized(value: string): string {
  return value.toLowerCase().replace(/[^a-z0-9+#.]/g, " ");
}

export function deterministicMatch(input: MatchInput): MatchAnalysis {
  const resume = normalized(`${input.candidate.resumeText} ${input.candidate.skills.join(" ")}`);
  const matchedSkills = input.job.skills.filter((skill) =>
    resume.includes(normalized(skill).trim()),
  );
  const missingSkills = input.job.skills.filter((skill) => !matchedSkills.includes(skill));
  const keywords = [...new Set(normalized(input.job.description).split(/\s+/))].filter(
    (word) => word.length >= 4 && !stopwords.has(word),
  );
  const keywordMatches = keywords.filter((word) => resume.includes(word));
  const skillScore = input.job.skills.length ? matchedSkills.length / input.job.skills.length : 0.5;
  const keywordScore = keywords.length ? keywordMatches.length / keywords.length : 0.5;
  const score = Math.max(0, Math.min(100, Math.round(skillScore * 70 + keywordScore * 30)));
  const recommendation =
    score >= 75 ? "STRONG_MATCH" : score >= 50 ? "POTENTIAL_MATCH" : "REVIEW_REQUIRED";

  return {
    score,
    recommendation,
    strengths: matchedSkills.length
      ? matchedSkills.slice(0, 6).map((skill) => `Evidence of ${skill}`)
      : ["Relevant profile submitted for human review"],
    gaps: missingSkills.slice(0, 6).map((skill) => `No explicit evidence of ${skill}`),
    summary: `${input.candidate.name} matches ${matchedSkills.length} of ${input.job.skills.length} requested skills for ${input.job.title}.`,
    rationale: `Deterministic scoring weights explicit skill overlap at 70% and job-description keyword coverage at 30%. The result supports recruiter review and never makes an autonomous hiring decision.`,
    source: "DETERMINISTIC",
    model: "deterministic-match-v1",
  };
}

async function geminiMatch(input: MatchInput): Promise<MatchAnalysis> {
  const prompt = `You are a recruitment decision-support assistant. Compare the candidate resume to the job. Use only evidence present in the supplied text. Do not infer protected characteristics. Scores support human review and must not autonomously reject a candidate.\n\nJOB\nTitle: ${input.job.title}\nRequired skills: ${input.job.skills.join(", ")}\nDescription: ${input.job.description}\n\nCANDIDATE\nCurrent title: ${input.candidate.currentTitle}\nExperience: ${input.candidate.yearsExperience} years\nDeclared skills: ${input.candidate.skills.join(", ")}\nResume: ${input.candidate.resumeText.slice(0, 30_000)}`;
  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(env.GEMINI_MODEL)}:generateContent`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-goog-api-key": env.GEMINI_API_KEY! },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          temperature: 0.1,
          responseMimeType: "application/json",
          responseSchema: {
            type: "object",
            properties: {
              score: { type: "integer", minimum: 0, maximum: 100 },
              recommendation: {
                type: "string",
                enum: ["STRONG_MATCH", "POTENTIAL_MATCH", "REVIEW_REQUIRED"],
              },
              strengths: { type: "array", items: { type: "string" }, maxItems: 6 },
              gaps: { type: "array", items: { type: "string" }, maxItems: 6 },
              summary: { type: "string" },
              rationale: { type: "string" },
            },
            required: ["score", "recommendation", "strengths", "gaps", "summary", "rationale"],
          },
        },
      }),
      signal: AbortSignal.timeout(15_000),
    },
  );
  if (!response.ok) throw new Error(`Gemini request failed with ${response.status}`);
  const body = (await response.json()) as {
    candidates?: Array<{ content?: { parts?: Array<{ text?: string }> } }>;
  };
  const text = body.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!text) throw new Error("Gemini returned no analysis");
  return {
    ...matchAnalysisSchema.parse(JSON.parse(text)),
    source: "GEMINI",
    model: env.GEMINI_MODEL,
  };
}

export async function analyzeMatch(input: MatchInput): Promise<MatchAnalysis> {
  if (env.GEMINI_API_KEY) {
    try {
      return await geminiMatch(input);
    } catch {
      return deterministicMatch(input);
    }
  }
  return deterministicMatch(input);
}
