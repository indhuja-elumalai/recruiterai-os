import { describe, expect, it } from "vitest";
import {
  developmentPasswordResetRequestSchema,
  loginRequestSchema,
  registerRequestSchema,
} from "@recruiterai/contracts";

describe("authentication contracts", () => {
  it("normalizes email casing and surrounding whitespace during login", () => {
    const input = loginRequestSchema.parse({
      email: "  Recruiter@Example.COM  ",
      password: "workspace-password",
    });

    expect(input.email).toBe("recruiter@example.com");
  });

  it("normalizes the email stored during registration", () => {
    const input = registerRequestSchema.parse({
      name: "Recruiter Test",
      email: "  Recruiter@Example.COM  ",
      password: "workspace-password",
      organizationName: "Ind Technologies",
    });

    expect(input.email).toBe("recruiter@example.com");
  });

  it("requires a strong password for a development reset", () => {
    const result = developmentPasswordResetRequestSchema.safeParse({
      email: "recruiter@example.com",
      newPassword: "too-short",
    });

    expect(result.success).toBe(false);
  });
});
