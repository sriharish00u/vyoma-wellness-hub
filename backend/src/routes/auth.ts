import { Router } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { User } from "../models/User";
import { registerSchema, loginSchema } from "../schemas";
import { verifyToken } from "../middleware/auth";

const router = Router();

const JWT_SECRET = process.env.JWT_SECRET ?? "fallback_secret";

router.post("/register", async (req, res, next) => {
  try {
    const data = registerSchema.parse(req.body);
    const existing = await User.findOne({ email: data.email });
    if (existing) {
      const err = new Error("Email already registered") as any;
      err.status = 409;
      throw err;
    }
    const hashed = await bcrypt.hash(data.password, 10);
    const user = await User.create({ name: data.name, email: data.email, password: hashed });
    const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: "7d" });
    res.status(201).json({
      token,
      user: { id: user._id, name: user.name, email: user.email, plan: user.plan, streak: user.streak },
    });
  } catch (err: any) {
    if (err.name === "ZodError") {
      res.status(400).json({ error: err.errors[0].message });
      return;
    }
    next(err);
  }
});

router.post("/login", async (req, res, next) => {
  try {
    const data = loginSchema.parse(req.body);
    const user = await User.findOne({ email: data.email }).select("+password");
    if (!user || !(await bcrypt.compare(data.password, user.password))) {
      const err = new Error("Invalid email or password") as any;
      err.status = 401;
      throw err;
    }
    const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: "7d" });
    res.json({
      token,
      user: { id: user._id, name: user.name, email: user.email, plan: user.plan, streak: user.streak },
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
    const user = await User.findById(req.user!.userId);
    if (!user) {
      const err = new Error("User not found") as any;
      err.status = 404;
      throw err;
    }
    res.json({ id: user._id, name: user.name, email: user.email, plan: user.plan, streak: user.streak, sessionsCompleted: user.sessionsCompleted });
  } catch (err) {
    next(err);
  }
});

export default router;
