import mongoose, { Schema, type InferSchemaType } from "mongoose";

const feedbackSchema = new Schema(
  {
    rating: { type: Number, required: true, min: 1, max: 5 },
    recommendation: {
      type: String,
      enum: ["STRONG_YES", "YES", "MIXED", "NO", "STRONG_NO"],
      required: true,
    },
    strengths: { type: String, required: true },
    concerns: { type: String, default: "" },
    notes: { type: String, default: "" },
    submittedAt: { type: Date, required: true },
  },
  { _id: false },
);

const interviewSchema = new Schema(
  {
    ownerId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    candidateId: { type: Schema.Types.ObjectId, ref: "Candidate", required: true, index: true },
    jobId: { type: Schema.Types.ObjectId, ref: "Job", required: true, index: true },
    candidateName: { type: String, required: true },
    jobTitle: { type: String, required: true },
    stage: {
      type: String,
      enum: ["SCREENING", "TECHNICAL", "MANAGER", "FINAL"],
      required: true,
    },
    scheduledAt: { type: Date, required: true, index: true },
    durationMinutes: { type: Number, required: true, min: 15, max: 240 },
    timezone: { type: String, required: true },
    meetingUrl: { type: String, default: "" },
    notes: { type: String, default: "" },
    status: {
      type: String,
      enum: ["SCHEDULED", "COMPLETED", "CANCELLED"],
      required: true,
      default: "SCHEDULED",
      index: true,
    },
    calendarProvider: { type: String, enum: ["LOCAL", "GOOGLE"], default: "LOCAL" },
    notificationStatus: {
      type: String,
      enum: ["SKIPPED", "SENT", "FAILED"],
      default: "SKIPPED",
      required: true,
    },
    questions: [{ type: String, required: true }],
    feedback: { type: feedbackSchema, default: null },
  },
  { timestamps: true },
);

interviewSchema.index({ ownerId: 1, scheduledAt: 1 });

export type InterviewDocument = InferSchemaType<typeof interviewSchema> & {
  _id: { toString(): string };
};

export const Interview = mongoose.models.Interview ?? mongoose.model("Interview", interviewSchema);
