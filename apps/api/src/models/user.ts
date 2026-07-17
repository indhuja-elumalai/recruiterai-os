import mongoose, { Schema, type InferSchemaType } from "mongoose";

const userSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String, required: true, select: false },
    role: {
      type: String,
      enum: ["ADMIN", "RECRUITER", "MANAGER", "INTERVIEWER", "CANDIDATE"],
      default: "ADMIN",
      required: true,
    },
    organizationName: { type: String, required: true, trim: true },
    tokenVersion: { type: Number, default: 0, required: true },
  },
  { timestamps: true },
);

export type UserDocument = InferSchemaType<typeof userSchema> & { _id: { toString(): string } };

export const User = mongoose.models.User ?? mongoose.model("User", userSchema);
