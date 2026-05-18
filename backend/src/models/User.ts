import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true, select: false },
  plan: { type: String, enum: ["starter", "member", "annual"], default: "starter" },
  streak: { type: Number, default: 0 },
  sessionsCompleted: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
});

export const User = mongoose.model("User", userSchema);
