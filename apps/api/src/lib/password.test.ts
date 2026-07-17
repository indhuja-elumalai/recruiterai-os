import { describe, expect, it } from "vitest";
import { hashPassword, verifyPassword } from "./password.js";

describe("password security", () => {
  it("hashes passwords with unique salts and verifies the original", async () => {
    const first = await hashPassword("a-strong-test-password");
    const second = await hashPassword("a-strong-test-password");

    expect(first).not.toBe(second);
    await expect(verifyPassword("a-strong-test-password", first)).resolves.toBe(true);
    await expect(verifyPassword("incorrect-password", first)).resolves.toBe(false);
  });
});
