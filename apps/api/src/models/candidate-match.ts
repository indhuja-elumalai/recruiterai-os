import mongoose, { Schema, type InferSchemaType } from "mongoose";

const candidateMatchSchema = new Schema(
  {
    ownerId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    candidateId: { type: Schema.Types.ObjectId, ref: "Candidate", required: true, index: true },
    jobId: { type: Schema.Types.ObjectId, ref: "Job", required: true, index: true },
    score: { type: Number, required: true, min: 0, max: 100 },
    recommendation: {
      type: String,
      enum: ["STRONG_MATCH", "POTENTIAL_MATCH", "REVIEW_REQUIRED"],
      required: true,
    },
    strengths: [{ type: String, required: true }],
    gaps: [{ type: String, required: true }],
    summary: { type: String, required: true },
    rationale: { type: String, required: true },
    source: { type: String, enum: ["GEMINI", "DETERMINISTIC"], required: true },
    model: { type: String, required: true },
    promptVersion: { type: String, required: true, default: "match-v1" },
    analyzedAt: { type: Date, required: true, default: Date.now },
  },
  { timestamps: true },
);

candidateMatchSchema.index({ ownerId: 1, candidateId: 1 }, { unique: true });

export type CandidateMatchDocument = InferSchemaType<typeof candidateMatchSchema> & {
  _id: { toString(): string };
};

export const CandidateMatch =
  mongoose.models.CandidateMatch ?? mongoose.model("CandidateMatch", candidateMatchSchema);
