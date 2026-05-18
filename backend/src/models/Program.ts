import mongoose from "mongoose";

const programSchema = new mongoose.Schema(
  {
    slug: { type: String, required: true, unique: true, index: true },
    title: { type: String, required: true },
    level: { type: String, required: true },
    duration: { type: String, required: true },
    tag: { type: String, required: true, index: true },
    desc: { type: String, required: true },
    icon: { type: String, required: true },
    order: { type: Number, required: true },
  },
  { timestamps: true }
);

export const Program = mongoose.model("Program", programSchema);
