import path from "node:path";
import { describe, expect, it } from "vitest";
import { resolveEnvPath } from "./load-env.js";

describe("resolveEnvPath", () => {
  it("prefers a workspace-local environment file", () => {
    const cwd = path.resolve("apps/api");
    expect(resolveEnvPath(cwd, (candidate) => candidate === path.join(cwd, ".env"))).toBe(
      path.join(cwd, ".env"),
    );
  });

  it("falls back to the monorepo root environment file", () => {
    const cwd = path.resolve("apps/api");
    const rootEnv = path.resolve(cwd, "../../.env");
    expect(resolveEnvPath(cwd, (candidate) => candidate === rootEnv)).toBe(rootEnv);
  });
});
