import { describe, expect, it } from "vitest";
import { extractResumeText } from "./resume.js";

function textResume(content: string): Express.Multer.File {
  return {
    buffer: Buffer.from(content),
    destination: "",
    encoding: "7bit",
    fieldname: "resume",
    filename: "",
    mimetype: "text/plain",
    originalname: "candidate-resume.txt",
    path: "",
    size: Buffer.byteLength(content),
    stream: undefined as never,
  };
}

describe("resume extraction", () => {
  it("normalizes a plain-text resume without retaining binary data", async () => {
    const text = await extractResumeText(
      textResume("AI Engineer\n\nPython   TypeScript\nBuilt explainable matching systems."),
    );

    expect(text).toContain("Python TypeScript");
    expect(text).toContain("explainable matching systems");
  });

  it("rejects files without enough extractable text", async () => {
    await expect(extractResumeText(textResume("Too short"))).rejects.toMatchObject({
      code: "RESUME_TEXT_REQUIRED",
    });
  });
});
