import { Router } from "express";
import { Program } from "../models/Program";
import { verifyToken, requireAdmin } from "../middleware/auth";
import { programSchema } from "../schemas";

const router = Router();

router.get("/", async (req, res, next) => {
  try {
    const filter: Record<string, any> = {};
    if (req.query.tag && req.query.tag !== "All") {
      filter.tag = req.query.tag as string;
    }
    const programs = await Program.find(filter).sort({ order: 1 });
    res.json(programs);
  } catch (err) {
    next(err);
  }
});

router.get("/:slug", async (req, res, next) => {
  try {
    const program = await Program.findOne({ slug: req.params.slug });
    if (!program) {
      const err = new Error("Program not found") as any;
      err.status = 404;
      throw err;
    }
    res.json(program);
  } catch (err) {
    next(err);
  }
});

router.post("/", verifyToken, requireAdmin, async (req, res, next) => {
  try {
    const data = programSchema.parse(req.body);
    const existing = await Program.findOne({ slug: data.slug });
    if (existing) {
      const err = new Error("A program with this slug already exists") as any;
      err.status = 409;
      throw err;
    }
    if (!data.order) {
      const last = await Program.findOne().sort({ order: -1 });
      data.order = (last?.order ?? 0) + 1;
    }
    const program = await Program.create(data);
    res.status(201).json(program);
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
    const data = programSchema.partial().parse(req.body);
    if (data.slug) {
      const collision = await Program.findOne({ slug: data.slug, _id: { $ne: req.params.id } });
      if (collision) {
        const err = new Error("A program with this slug already exists") as any;
        err.status = 409;
        throw err;
      }
    }
    const program = await Program.findByIdAndUpdate(req.params.id, data, { new: true, runValidators: true });
    if (!program) {
      const err = new Error("Program not found") as any;
      err.status = 404;
      throw err;
    }
    res.json(program);
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
    const program = await Program.findByIdAndDelete(req.params.id);
    if (!program) {
      const err = new Error("Program not found") as any;
      err.status = 404;
      throw err;
    }
    res.json({ success: true, message: "Program deleted" });
  } catch (err) {
    next(err);
  }
});

export default router;
