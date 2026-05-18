import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true, index: true },
    password: { type: String, required: true, select: false },
    role: { type: String, enum: ["user", "admin"], default: "user" },
    plan: { type: String, enum: ["starter", "member", "annual"], default: "starter" },
    streak: { type: Number, default: 0 },
    sessionsCompleted: { type: Number, default: 0 },
    lastLoginAt: { type: Date, default: null },
    isVerified: { type: Boolean, default: false },
    isBanned: { type: Boolean, default: false },
    needsSetup: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export const User = mongoose.model("User", userSchema);
