import { Router } from "express";
import { User } from "../models/User";
import { Contact } from "../models/Contact";
import { Session } from "../models/Session";
import { Program } from "../models/Program";
import { Event } from "../models/Event";
import { verifyToken, requireAdmin } from "../middleware/auth";

const router = Router();

router.get("/stats", async (_req, res, next) => {
  try {
    const [users, admins, verified, sessions, programs, events] = await Promise.all([
      User.countDocuments({ role: "user" }),
      User.countDocuments({ role: "admin" }),
      User.countDocuments({ isVerified: true }),
      Session.countDocuments(),
      Program.countDocuments(),
      Event.countDocuments(),
    ]);
    res.json({ users, admins, verified, sessions, programs, events });
  } catch (err) {
    next(err);
  }
});

router.get("/users", verifyToken, requireAdmin, async (req, res, next) => {
  try {
    const page = Math.max(1, parseInt(req.query.page as string) || 1);
    const limit = Math.min(50, parseInt(req.query.limit as string) || 20);
    const skip = (page - 1) * limit;

    const [users, total] = await Promise.all([
      User.find({}, "-password").sort({ createdAt: -1 }).skip(skip).limit(limit),
      User.countDocuments(),
    ]);

    res.json({ users, total, page, pages: Math.ceil(total / limit) });
  } catch (err) {
    next(err);
  }
});

router.get("/contacts", verifyToken, requireAdmin, async (req, res, next) => {
  try {
    const page = Math.max(1, parseInt(req.query.page as string) || 1);
    const limit = Math.min(50, parseInt(req.query.limit as string) || 20);
    const skip = (page - 1) * limit;

    const [contacts, total] = await Promise.all([
      Contact.find().sort({ createdAt: -1 }).skip(skip).limit(limit),
      Contact.countDocuments(),
    ]);

    res.json({ contacts, total, page, pages: Math.ceil(total / limit) });
  } catch (err) {
    next(err);
  }
});

router.patch("/users/:id/verify", verifyToken, requireAdmin, async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      const err = new Error("User not found") as any;
      err.status = 404;
      throw err;
    }
    user.isVerified = !user.isVerified;
    await user.save();
    res.json({ id: user._id, isVerified: user.isVerified });
  } catch (err) {
    next(err);
  }
});

router.patch("/users/:id/ban", verifyToken, requireAdmin, async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      const err = new Error("User not found") as any;
      err.status = 404;
      throw err;
    }
    user.isBanned = !user.isBanned;
    await user.save();
    res.json({ id: user._id, isBanned: user.isBanned });
  } catch (err) {
    next(err);
  }
});

router.delete("/users/:id", verifyToken, requireAdmin, async (req, res, next) => {
  try {
    if (req.query.confirm !== "true") {
      const err = new Error("Confirm deletion with ?confirm=true") as any;
      err.status = 400;
      throw err;
    }
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      const err = new Error("User not found") as any;
      err.status = 404;
      throw err;
    }
    res.json({ success: true });
  } catch (err) {
    next(err);
  }
});

router.patch("/users/:id/plan", verifyToken, requireAdmin, async (req, res, next) => {
  try {
    const { plan } = req.body;
    if (!["starter", "member", "annual"].includes(plan)) {
      const err = new Error("Plan must be starter, member, or annual") as any;
      err.status = 400;
      throw err;
    }
    const user = await User.findByIdAndUpdate(req.params.id, { plan }, { new: true, select: "-password" });
    if (!user) {
      const err = new Error("User not found") as any;
      err.status = 404;
      throw err;
    }
    res.json(user);
  } catch (err) {
    next(err);
  }
});

export default router;
