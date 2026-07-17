import request from "supertest";
import { describe, expect, it } from "vitest";
import { healthResponseSchema } from "@recruiterai/contracts";
import { createApp } from "./app.js";

describe("API foundation", () => {
  it("returns a typed health response", async () => {
    const response = await request(createApp()).get("/api/v1/health").expect(200);
    const parsed = healthResponseSchema.parse(response.body);

    expect(parsed.data.status).toBe("ok");
    expect(parsed.data.database).toBe("not_configured");
    expect(response.headers["x-request-id"]).toBe(parsed.requestId);
  });

  it("returns the standard error envelope for missing routes", async () => {
    const response = await request(createApp()).get("/api/v1/missing").expect(404);

    expect(response.body.error).toMatchObject({
      code: "ROUTE_NOT_FOUND",
    });
    expect(response.body.error.requestId).toEqual(expect.any(String));
  });

  it("rejects invalid registration data before database access", async () => {
    const response = await request(createApp())
      .post("/api/v1/auth/register")
      .send({ email: "invalid", password: "short" })
      .expect(422);

    expect(response.body.error.code).toBe("VALIDATION_ERROR");
  });

  it("protects authenticated routes", async () => {
    const response = await request(createApp()).get("/api/v1/auth/me").expect(401);
    expect(response.body.error.code).toBe("AUTHENTICATION_REQUIRED");
  });

  it("protects job data from unauthenticated access", async () => {
    const response = await request(createApp()).get("/api/v1/jobs").expect(401);
    expect(response.body.error.code).toBe("AUTHENTICATION_REQUIRED");
  });

  it("protects candidate data from unauthenticated access", async () => {
    const response = await request(createApp()).get("/api/v1/candidates").expect(401);
    expect(response.body.error.code).toBe("AUTHENTICATION_REQUIRED");
  });
});
