import { Router } from "express";
import { Program } from "../models/Program";

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

export default router;
