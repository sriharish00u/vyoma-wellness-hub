import { Router } from "express";
import { TrialRegistration } from "../models/TrialRegistration.js";
import { trialRegistrationSchema } from "../schemas/index.js";

const router = Router();

// Submit registration
router.post("/", async (req, res, next) => {
  try {
    const data = trialRegistrationSchema.parse(req.body);

    // If hasPhysicalRestrictions is "Yes" and physicalRestrictionsDetail is empty, check
    if (data.hasPhysicalRestrictions === "Yes" && !data.physicalRestrictionsDetail?.trim()) {
      res.status(400).json({ error: "Please briefly describe your physical restrictions" });
      return;
    }

    const registration = await TrialRegistration.create(data);
    res.status(201).json({
      success: true,
      message: "Registration received successfully!",
      id: registration._id,
    });
  } catch (err: any) {
    if (err.name === "ZodError") {
      res.status(400).json({ error: err.errors[0]?.message || "Validation failed" });
      return;
    }
    next(err);
  }
});

// Get registrations (supports filters, search, pagination, or all for export)
router.get("/", async (req, res, next) => {
  try {
    const {
      search,
      profession,
      experience,
      commitment,
      hasRestrictions,
      page = "1",
      limit = "50",
      all = "false",
      sort = "desc",
    } = req.query;

    const query: Record<string, any> = {};

    if (search && typeof search === "string" && search.trim()) {
      const s = search.trim();
      query.$or = [
        { fullName: { $regex: s, $options: "i" } },
        { email: { $regex: s, $options: "i" } },
        { whatsappNumber: { $regex: s, $options: "i" } },
        { profession: { $regex: s, $options: "i" } },
      ];
    }

    if (profession && typeof profession === "string" && profession !== "all") {
      query.profession = profession;
    }

    if (experience && typeof experience === "string" && experience !== "all") {
      query.yogaExperience = experience;
    }

    if (commitment && typeof commitment === "string" && commitment !== "all") {
      query.morningCommitment = commitment;
    }

    if (hasRestrictions && typeof hasRestrictions === "string" && hasRestrictions !== "all") {
      query.hasPhysicalRestrictions = hasRestrictions;
    }

    const sortOrder = sort === "asc" ? 1 : -1;

    if (all === "true") {
      const registrations = await TrialRegistration.find(query).sort({ createdAt: sortOrder });
      res.json({
        registrations,
        total: registrations.length,
      });
      return;
    }

    const pageNum = Math.max(1, parseInt(page as string, 10) || 1);
    const limitNum = Math.min(100, Math.max(1, parseInt(limit as string, 10) || 50));
    const skip = (pageNum - 1) * limitNum;

    const [registrations, total] = await Promise.all([
      TrialRegistration.find(query).sort({ createdAt: sortOrder }).skip(skip).limit(limitNum),
      TrialRegistration.countDocuments(query),
    ]);

    res.json({
      registrations,
      total,
      page: pageNum,
      limit: limitNum,
      pages: Math.ceil(total / limitNum),
    });
  } catch (err) {
    next(err);
  }
});

// Summary stats for registrations
router.get("/stats", async (_req, res, next) => {
  try {
    const [
      total,
      committed,
      beginners,
      withRestrictions,
      recentRegistrations,
      allProfessions,
      allGoals,
    ] = await Promise.all([
      TrialRegistration.countDocuments(),
      TrialRegistration.countDocuments({ morningCommitment: { $regex: /committed/i } }),
      TrialRegistration.countDocuments({ yogaExperience: { $regex: /never/i } }),
      TrialRegistration.countDocuments({ hasPhysicalRestrictions: "Yes" }),
      TrialRegistration.find().sort({ createdAt: -1 }).limit(5),
      TrialRegistration.aggregate([
        { $group: { _id: "$profession", count: { $sum: 1 } } },
        { $sort: { count: -1 } },
      ]),
      TrialRegistration.aggregate([
        { $unwind: "$goals" },
        { $group: { _id: "$goals", count: { $sum: 1 } } },
        { $sort: { count: -1 } },
      ]),
    ]);

    res.json({
      total,
      committed,
      beginners,
      withRestrictions,
      recent: recentRegistrations,
      professions: allProfessions,
      goals: allGoals,
    });
  } catch (err) {
    next(err);
  }
});

// Delete registration by ID
router.delete("/:id", async (req, res, next) => {
  try {
    const deleted = await TrialRegistration.findByIdAndDelete(req.params.id);
    if (!deleted) {
      res.status(404).json({ error: "Registration not found" });
      return;
    }
    res.json({ success: true, message: "Registration deleted successfully" });
  } catch (err) {
    next(err);
  }
});

export default router;
