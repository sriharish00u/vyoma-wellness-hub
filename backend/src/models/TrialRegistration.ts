import mongoose from "mongoose";

const trialRegistrationSchema = new mongoose.Schema(
  {
    fullName: { type: String, required: true, trim: true },
    age: { type: Number, required: true, min: 5, max: 120 },
    whatsappNumber: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, lowercase: true },
    profession: { type: String, required: true, trim: true },
    professionOther: { type: String, trim: true, default: "" },
    yogaExperience: { type: String, required: true, trim: true },
    goals: { type: [String], default: [] },
    goalsOther: { type: String, trim: true, default: "" },
    hopesToGain: { type: String, trim: true, default: "" },
    hasPhysicalRestrictions: { type: String, required: true, enum: ["No", "Yes"] },
    physicalRestrictionsDetail: { type: String, trim: true, default: "" },
    morningCommitment: { type: String, required: true, trim: true },
    comfortableFollowingGuidance: { type: String, required: true, enum: ["Yes", "No"] },
    hearAbout: { type: String, trim: true, default: "" },
    hearAboutOther: { type: String, trim: true, default: "" },
    agreeTerms: { type: Boolean, required: true, default: true },
    futureUpdates: { type: String, enum: ["Yes", "No", ""], default: "" },
    status: { type: String, default: "registered", enum: ["registered", "attended", "cancelled"] },
  },
  { timestamps: true }
);

// Indexes for fast lookup & filtering
trialRegistrationSchema.index({ createdAt: -1 });
trialRegistrationSchema.index({ email: 1 });
trialRegistrationSchema.index({ whatsappNumber: 1 });

export const TrialRegistration = mongoose.model("TrialRegistration", trialRegistrationSchema);
