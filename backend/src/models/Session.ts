import mongoose from "mongoose";

const sessionSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    programSlug: { type: String, required: true, index: true },
    coach: { type: String, required: true },
    scheduledAt: { type: Date, required: true, index: true },
    durationMin: { type: Number, required: true },
    joinLink: { type: String, default: "" },
    isLive: { type: Boolean, default: false },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export const Session = mongoose.model("Session", sessionSchema);
