import mongoose from "mongoose";

const eventSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    type: { type: String, enum: ["workshop", "challenge", "webinar", "community"], required: true },
    scheduledAt: { type: Date, required: true, index: true },
    durationMin: { type: Number, required: true },
    mode: { type: String, enum: ["online", "offline"], default: "online" },
    joinLink: { type: String, default: "" },
    place: { type: String, default: "" },
    status: { type: String, enum: ["upcoming", "live", "completed"], default: "upcoming", index: true },
    recordingUrl: { type: String, default: "" },
    coverImage: { type: String, default: "" },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export const Event = mongoose.model("Event", eventSchema);
