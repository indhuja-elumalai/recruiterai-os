import { describe, expect, it } from "vitest";
import { deterministicMatch } from "./matching.js";

describe("deterministic candidate matching", () => {
  it("produces an explainable score from skill and keyword evidence", () => {
    const result = deterministicMatch({
      candidate: {
        name: "Ananya Rao",
        currentTitle: "AI Engineer",
        yearsExperience: 4,
        skills: ["Python", "TypeScript", "RAG"],
        resumeText:
          "Built production Python and TypeScript APIs for retrieval augmented generation and model evaluation.",
      },
      job: {
        title: "AI Platform Engineer",
        description:
          "Build production APIs, retrieval systems, model evaluation, and monitored AI workflows.",
        skills: ["Python", "TypeScript", "RAG", "MongoDB"],
      },
    });

    expect(result.source).toBe("DETERMINISTIC");
    expect(result.score).toBeGreaterThan(50);
    expect(result.strengths).toContain("Evidence of Python");
    expect(result.gaps).toContain("No explicit evidence of MongoDB");
  });

  it("never produces a score outside the documented range", () => {
    const result = deterministicMatch({
      candidate: {
        name: "Candidate",
        currentTitle: "Designer",
        yearsExperience: 1,
        skills: ["Figma"],
        resumeText: "Product design portfolio with user research and interface prototypes.",
      },
      job: {
        title: "Backend Engineer",
        description:
          "Build distributed backend services with observability and database performance.",
        skills: ["Node.js", "MongoDB", "Redis"],
      },
    });

    expect(result.score).toBeGreaterThanOrEqual(0);
    expect(result.score).toBeLessThanOrEqual(100);
    expect(result.recommendation).toBe("REVIEW_REQUIRED");
  });
});
