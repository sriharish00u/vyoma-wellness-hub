import { Router } from "express";
import { Event } from "../models/Event";
import { verifyToken, requireAdmin } from "../middleware/auth";
import { eventSchema } from "../schemas";

const router = Router();

router.get("/", async (req, res, next) => {
  try {
    const now = new Date();

    await Event.updateMany(
      { status: "upcoming", scheduledAt: { $lte: now } },
      { $set: { status: "live" } }
    );

    await Event.updateMany(
      { status: "live", scheduledAt: { $lte: new Date(now.getTime() - 60 * 60 * 1000) } },
      { $set: { status: "completed" } }
    );

    const filter: Record<string, any> = {};
    if (req.query.status) {
      filter.status = req.query.status;
    }
    const events = await Event.find(filter).sort({ scheduledAt: 1 });
    res.json(events);
  } catch (err) {
    next(err);
  }
});

router.get("/:id", async (req, res, next) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) {
      const err = new Error("Event not found") as any;
      err.status = 404;
      throw err;
    }
    res.json(event);
  } catch (err) {
    next(err);
  }
});

router.post("/", verifyToken, requireAdmin, async (req, res, next) => {
  try {
    const data = eventSchema.parse(req.body);
    const event = await Event.create(data);
    res.status(201).json(event);
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
    const data = eventSchema.partial().parse(req.body);
    const event = await Event.findByIdAndUpdate(req.params.id, data, { new: true, runValidators: true });
    if (!event) {
      const err = new Error("Event not found") as any;
      err.status = 404;
      throw err;
    }
    res.json(event);
  } catch (err: any) {
    if (err.name === "ZodError") {
      res.status(400).json({ error: err.errors[0].message });
      return;
    }
    next(err);
  }
});

router.patch("/:id/recording", verifyToken, requireAdmin, async (req, res, next) => {
  try {
    const { recordingUrl } = req.body;
    if (!recordingUrl || typeof recordingUrl !== "string") {
      const err = new Error("recordingUrl is required") as any;
      err.status = 400;
      throw err;
    }
    try {
      new URL(recordingUrl);
    } catch {
      const err = new Error("Invalid URL") as any;
      err.status = 400;
      throw err;
    }
    const event = await Event.findByIdAndUpdate(
      req.params.id,
      { recordingUrl, status: "completed" },
      { new: true }
    );
    if (!event) {
      const err = new Error("Event not found") as any;
      err.status = 404;
      throw err;
    }
    res.json(event);
  } catch (err) {
    next(err);
  }
});

router.delete("/:id", verifyToken, requireAdmin, async (req, res, next) => {
  try {
    const event = await Event.findByIdAndDelete(req.params.id);
    if (!event) {
      const err = new Error("Event not found") as any;
      err.status = 404;
      throw err;
    }
    res.json({ success: true });
  } catch (err) {
    next(err);
  }
});

export default router;
