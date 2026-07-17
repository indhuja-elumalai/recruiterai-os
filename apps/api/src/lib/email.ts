import { env } from "../config/env.js";

interface InterviewEmailInput {
  candidateEmail: string;
  candidateName: string;
  jobTitle: string;
  meetingUrl: string;
  scheduledAt: Date;
  stage: string;
  timezone: string;
}

export async function sendInterviewInvitation(
  input: InterviewEmailInput,
): Promise<"SKIPPED" | "SENT" | "FAILED"> {
  if (!env.RESEND_API_KEY || !env.EMAIL_FROM) return "SKIPPED";

  try {
    const schedule = input.scheduledAt.toLocaleString("en-IN", {
      dateStyle: "full",
      timeStyle: "short",
      timeZone: input.timezone,
    });
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${env.RESEND_API_KEY}`,
        "Content-Type": "application/json",
        "Idempotency-Key": `interview-${input.candidateEmail}-${input.scheduledAt.getTime()}`,
        "User-Agent": "RecruiterAI-OS/0.1.0",
      },
      body: JSON.stringify({
        from: env.EMAIL_FROM,
        to: [input.candidateEmail],
        subject: `${input.stage.toLowerCase()} interview · ${input.jobTitle}`,
        html: `<div style="font-family:Arial,sans-serif;color:#111827"><h2>Interview scheduled</h2><p>Hello ${escapeHtml(input.candidateName)},</p><p>Your ${escapeHtml(input.stage.toLowerCase())} interview for <strong>${escapeHtml(input.jobTitle)}</strong> is scheduled for ${escapeHtml(schedule)}.</p>${input.meetingUrl ? `<p><a href="${escapeHtml(input.meetingUrl)}">Join interview</a></p>` : ""}<p>RecruiterAI</p></div>`,
      }),
      signal: AbortSignal.timeout(8_000),
    });
    return response.ok ? "SENT" : "FAILED";
  } catch {
    return "FAILED";
  }
}

function escapeHtml(value: string): string {
  return value.replace(/[&<>'"]/g, (character) => {
    const entities: Record<string, string> = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      "'": "&#39;",
      '"': "&quot;",
    };
    return entities[character];
  });
}
