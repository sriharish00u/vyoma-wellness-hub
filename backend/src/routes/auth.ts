import { Router } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import rateLimit from "express-rate-limit";
import { User } from "../models/User.js";
import { registerSchema, loginSchema } from "../schemas/index.js";
import { verifyToken } from "../middleware/auth.js";

const router = Router();

const JWT_SECRET = process.env.JWT_SECRET ?? "fallback_secret";

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  message: { error: "Too many requests, please try again later." },
  standardHeaders: true,
  legacyHeaders: false,
});

router.post("/register", authLimiter, async (req, res, next) => {
  try {
    const data = registerSchema.parse(req.body);
    const existing = await User.findOne({ email: data.email });
    if (existing) {
      const err = new Error("Email already registered") as any;
      err.status = 409;
      throw err;
    }
    const hashed = await bcrypt.hash(data.password, 10);
    const user = await User.create({ name: data.name, email: data.email, password: hashed, role: "user" });
    const token = jwt.sign({ userId: user._id, role: user.role }, JWT_SECRET, { expiresIn: "7d" });
    res.status(201).json({
      token,
      user: { id: user._id, name: user.name, email: user.email, role: user.role, plan: user.plan, streak: user.streak, isVerified: user.isVerified },
    });
  } catch (err: any) {
    if (err.name === "ZodError") {
      res.status(400).json({ error: err.errors[0].message });
      return;
    }
    next(err);
  }
});

router.post("/login", authLimiter, async (req, res, next) => {
  try {
    const data = loginSchema.parse(req.body);
    const user = await User.findOne({ email: data.email }).select("+password");
    if (!user || !user.password) {
      const err = new Error("Invalid email or password") as any;
      err.status = 401;
      throw err;
    }
    if (user.isBanned) {
      res.status(403).json({ error: "Your account has been suspended." });
      return;
    }
    const passwordMatch = await bcrypt.compare(data.password, user.password);
    if (!passwordMatch) {
      const err = new Error("Invalid email or password") as any;
      err.status = 401;
      throw err;
    }

    const now = new Date();
    const lastLogin = user.lastLoginAt;
    let newStreak = user.streak;

    if (!lastLogin) {
      newStreak = 1;
    } else {
      const lastDay = new Date(lastLogin).setHours(0, 0, 0, 0);
      const today = new Date(now).setHours(0, 0, 0, 0);
      const diffDays = Math.round((today - lastDay) / (1000 * 60 * 60 * 24));
      if (diffDays === 1) {
        newStreak += 1;
      } else if (diffDays > 1) {
        newStreak = 1;
      }
    }

    user.streak = newStreak;
    user.lastLoginAt = now;
    await user.save();

    const token = jwt.sign({ userId: user._id, role: user.role }, JWT_SECRET, { expiresIn: "7d" });
    res.json({
      token,
      user: { id: user._id, name: user.name, email: user.email, role: user.role, plan: user.plan, streak: user.streak, sessionsCompleted: user.sessionsCompleted, isVerified: user.isVerified },
    });
  } catch (err: any) {
    if (err.name === "ZodError") {
      res.status(400).json({ error: err.errors[0].message });
      return;
    }
    next(err);
  }
});

router.get("/me", verifyToken, async (req, res, next) => {
  try {
    res.setHeader("Cache-Control", "no-store");
    const user = await User.findById(req.user!.userId);
    if (!user) {
      const err = new Error("User not found") as any;
      err.status = 404;
      throw err;
    }
    res.json({
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      plan: user.plan,
      streak: user.streak,
      sessionsCompleted: user.sessionsCompleted,
      isVerified: user.isVerified,
    });
  } catch (err) {
    next(err);
  }
});

export default router;
