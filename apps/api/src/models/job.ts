import mongoose, { Schema, type InferSchemaType } from "mongoose";

const jobSchema = new Schema(
  {
    ownerId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    organizationName: { type: String, required: true, trim: true },
    title: { type: String, required: true, trim: true },
    department: { type: String, required: true, trim: true },
    location: { type: String, required: true, trim: true },
    workplaceType: {
      type: String,
      enum: ["REMOTE", "HYBRID", "ON_SITE"],
      required: true,
    },
    employmentType: {
      type: String,
      enum: ["FULL_TIME", "PART_TIME", "CONTRACT", "INTERNSHIP"],
      required: true,
    },
    description: { type: String, required: true, trim: true },
    skills: [{ type: String, required: true, trim: true }],
    salaryMin: { type: Number, default: null },
    salaryMax: { type: Number, default: null },
    currency: { type: String, required: true, default: "INR", uppercase: true },
    status: {
      type: String,
      enum: ["DRAFT", "PUBLISHED", "PAUSED", "CLOSED"],
      required: true,
      default: "DRAFT",
      index: true,
    },
    applicantCount: { type: Number, default: 0, min: 0, required: true },
  },
  { timestamps: true },
);

jobSchema.index({ ownerId: 1, updatedAt: -1 });

export type JobDocument = InferSchemaType<typeof jobSchema> & {
  _id: { toString(): string };
};

export const Job = mongoose.models.Job ?? mongoose.model("Job", jobSchema);
