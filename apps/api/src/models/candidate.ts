import mongoose, { Schema, type InferSchemaType } from "mongoose";

const candidateSchema = new Schema(
  {
    ownerId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    jobId: { type: Schema.Types.ObjectId, ref: "Job", required: true, index: true },
    jobTitle: { type: String, required: true, trim: true },
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, lowercase: true, trim: true },
    phone: { type: String, required: true, trim: true },
    location: { type: String, required: true, trim: true },
    currentTitle: { type: String, required: true, trim: true },
    yearsExperience: { type: Number, required: true, min: 0, max: 60 },
    skills: [{ type: String, required: true, trim: true }],
    status: {
      type: String,
      enum: ["APPLIED", "SCREENING", "INTERVIEW", "OFFER", "HIRED", "REJECTED"],
      required: true,
      default: "APPLIED",
      index: true,
    },
    resumeFileName: { type: String, required: true },
    resumeMimeType: { type: String, required: true },
    resumeText: { type: String, required: true, select: false },
    resumeCharacters: { type: Number, required: true, min: 0 },
    resumePreview: { type: String, required: true },
  },
  { timestamps: true },
);

candidateSchema.index({ ownerId: 1, updatedAt: -1 });
candidateSchema.index({ ownerId: 1, jobId: 1, email: 1 }, { unique: true });

export type CandidateDocument = InferSchemaType<typeof candidateSchema> & {
  _id: { toString(): string };
};

export const Candidate = mongoose.models.Candidate ?? mongoose.model("Candidate", candidateSchema);
