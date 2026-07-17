import { describe, expect, it } from "vitest";
import { generateInterviewQuestions } from "./screening.js";

describe("structured interview question generation", () => {
  it("builds a bounded evidence-based kit from job skills", () => {
    const questions = generateInterviewQuestions({
      candidateName: "Ananya Rao",
      currentTitle: "AI Engineer",
      jobTitle: "AI Platform Engineer",
      jobSkills: ["Python", "RAG", "TypeScript", "MongoDB"],
      stage: "TECHNICAL",
    });

    expect(questions).toHaveLength(5);
    expect(questions.some((question) => question.includes("Python"))).toBe(true);
    expect(questions.some((question) => question.includes("technical trade-off"))).toBe(true);
  });
});
