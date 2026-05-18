import { Router } from "express";
import { Settings } from "../models/Settings.js";
import { verifyToken, requireAdmin } from "../middleware/auth.js";

const router = Router();

router.get("/", async (req, res, next) => {
  try {
    const { key } = req.query;
    if (typeof key === "string") {
      const doc = await Settings.findOne({ key });
      res.json(doc ? { key: doc.key, value: doc.value } : { key, value: null });
    } else {
      const docs = await Settings.find({});
      const map: Record<string, unknown> = {};
      docs.forEach((d) => { map[d.key] = d.value; });
      res.json(map);
    }
  } catch (err) {
    next(err);
  }
});

router.put("/:key", verifyToken, requireAdmin, async (req, res, next) => {
  try {
    const { key } = req.params;
    const { value } = req.body;
    const doc = await Settings.findOneAndUpdate(
      { key },
      { key, value },
      { upsert: true, new: true }
    );
    res.json({ key: doc.key, value: doc.value });
  } catch (err) {
    next(err);
  }
});

export default router;
