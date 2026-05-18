import { Router } from "express";
import { Session } from "../models/Session.js";
import { verifyToken, requireAdmin } from "../middleware/auth.js";
import { sessionSchema } from "../schemas/index.js";

const router = Router();

router.get("/", async (_req, res, next) => {
  try {
    const sessions = await Session.find().sort({ scheduledAt: 1 });
    res.json(sessions);
  } catch (err) {
    next(err);
  }
});

router.get("/:id", async (req, res, next) => {
  try {
    const session = await Session.findById(req.params.id);
    if (!session) {
      const err = new Error("Session not found") as any;
      err.status = 404;
      throw err;
    }
    res.json(session);
  } catch (err) {
    next(err);
  }
});

router.post("/", verifyToken, requireAdmin, async (req, res, next) => {
  try {
    const data = sessionSchema.parse(req.body);
    const session = await Session.create(data);
    res.status(201).json(session);
  } catch (err: any) {
    if (err.name === "ZodError") {
      res.status(400).json({ error: err.errors[0].message });
      return;
    }
    next(err);
  }
});

router.put("/:id", verifyToken, requireAdmin, async (req, res, next) => {
  try {
    const data = sessionSchema.partial().parse(req.body);
    const session = await Session.findByIdAndUpdate(req.params.id, data, { new: true, runValidators: true });
    if (!session) {
      const err = new Error("Session not found") as any;
      err.status = 404;
      throw err;
    }
    res.json(session);
  } catch (err: any) {
    if (err.name === "ZodError") {
      res.status(400).json({ error: err.errors[0].message });
      return;
    }
    next(err);
  }
});

router.delete("/:id", verifyToken, requireAdmin, async (req, res, next) => {
  try {
    const session = await Session.findByIdAndDelete(req.params.id);
    if (!session) {
      const err = new Error("Session not found") as any;
      err.status = 404;
      throw err;
    }
    res.json({ success: true });
  } catch (err) {
    next(err);
  }
});

export default router;
