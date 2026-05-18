import { Router } from "express";
import { Quote } from "../models/Quote";
import { User } from "../models/User";
import { verifyToken } from "../middleware/auth";

const router = Router();

router.get("/", async (_req, res, next) => {
  try {
    const quotes = await Quote.find().sort({ createdAt: -1 }).limit(50);
    res.json(quotes);
  } catch (err) {
    next(err);
  }
});

router.post("/", verifyToken, async (req, res, next) => {
  try {
    const user = await User.findById(req.user!.userId);
    if (!user || !user.isVerified) {
      const err = new Error("Only verified users can post quotes") as any;
      err.status = 403;
      throw err;
    }
    const { text } = req.body;
    if (!text || typeof text !== "string" || text.trim().length < 10 || text.length > 500) {
      const err = new Error("Quote must be 10-500 characters") as any;
      err.status = 400;
      throw err;
    }
    const quote = await Quote.create({ userId: user._id, userName: user.name, text: text.trim() });
    res.status(201).json(quote);
  } catch (err) {
    next(err);
  }
});

router.delete("/:id", verifyToken, async (req, res, next) => {
  try {
    const user = await User.findById(req.user!.userId);
    const quote = await Quote.findById(req.params.id);
    if (!quote) {
      const err = new Error("Quote not found") as any;
      err.status = 404;
      throw err;
    }
    if (user?.role !== "admin" && quote.userId.toString() !== req.user!.userId) {
      const err = new Error("Not authorized") as any;
      err.status = 403;
      throw err;
    }
    await Quote.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (err) {
    next(err);
  }
});

export default router;
