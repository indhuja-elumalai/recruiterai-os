import { describe, expect, it } from "vitest";
import { createJobRequestSchema, updateJobRequestSchema } from "@recruiterai/contracts";

const validJob = {
  title: "Senior AI Engineer",
  department: "Engineering",
  location: "Chennai",
  workplaceType: "HYBRID",
  employmentType: "FULL_TIME",
  description: "Build explainable AI systems for high-quality recruitment decision support.",
  skills: ["TypeScript", "Python", "LLMs"],
  salaryMin: 1_800_000,
  salaryMax: 2_800_000,
  currency: "inr",
  status: "DRAFT",
};

describe("job contracts", () => {
  it("accepts and normalizes a complete job requisition", () => {
    const parsed = createJobRequestSchema.parse(validJob);

    expect(parsed.currency).toBe("INR");
    expect(parsed.skills).toEqual(["TypeScript", "Python", "LLMs"]);
  });

  it("rejects an inverted salary range", () => {
    const result = createJobRequestSchema.safeParse({
      ...validJob,
      salaryMin: 3_000_000,
      salaryMax: 2_000_000,
    });

    expect(result.success).toBe(false);
  });

  it("allows bounded lifecycle-only updates", () => {
    expect(updateJobRequestSchema.parse({ status: "PUBLISHED" })).toEqual({
      status: "PUBLISHED",
    });
  });
});
