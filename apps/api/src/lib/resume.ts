import { PDFParse } from "pdf-parse";
import { HttpError } from "./http-error.js";

const MAX_EXTRACTED_CHARACTERS = 100_000;

export async function extractResumeText(file: Express.Multer.File): Promise<string> {
  let text: string;

  if (file.mimetype === "text/plain") {
    text = file.buffer.toString("utf8");
  } else if (file.mimetype === "application/pdf") {
    const parser = new PDFParse({ data: file.buffer });
    try {
      const result = await parser.getText();
      text = result.text;
    } catch {
      throw new HttpError(422, "RESUME_PARSE_FAILED", "The PDF resume could not be read");
    } finally {
      await parser.destroy();
    }
  } else {
    throw new HttpError(422, "UNSUPPORTED_RESUME", "Upload a PDF or plain-text resume");
  }

  const normalized = text
    .split("\u0000")
    .join("")
    .replace(/[ \t]+/g, " ")
    .trim();
  if (normalized.length < 30) {
    throw new HttpError(422, "RESUME_TEXT_REQUIRED", "The resume does not contain enough text");
  }

  return normalized.slice(0, MAX_EXTRACTED_CHARACTERS);
}
