import { describe, expect, it } from "vitest";
import {
  createCandidateRequestSchema,
  updateCandidateStatusRequestSchema,
} from "@recruiterai/contracts";

const candidate = {
  jobId: "507f1f77bcf86cd799439011",
  name: "Ananya Rao",
  email: "  ANANYA@example.com ",
  phone: "+91 98765 43210",
  location: "Bengaluru",
  currentTitle: "Machine Learning Engineer",
  yearsExperience: 4,
  skills: ["Python", "RAG", "LLMs"],
};

describe("candidate contracts", () => {
  it("normalizes candidate email while retaining structured profile data", () => {
    const parsed = createCandidateRequestSchema.parse(candidate);

    expect(parsed.email).toBe("ananya@example.com");
    expect(parsed.skills).toEqual(["Python", "RAG", "LLMs"]);
  });

  it("rejects impossible experience values", () => {
    expect(
      createCandidateRequestSchema.safeParse({ ...candidate, yearsExperience: 75 }).success,
    ).toBe(false);
  });

  it("accepts a bounded candidate pipeline transition", () => {
    expect(updateCandidateStatusRequestSchema.parse({ status: "INTERVIEW" })).toEqual({
      status: "INTERVIEW",
    });
  });
});
