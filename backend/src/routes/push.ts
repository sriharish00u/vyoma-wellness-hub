import { Router } from "express";
import { z } from "zod";
import { Subscription } from "../models/Subscription.js";
import { verifyToken } from "../middleware/auth.js";
import { User } from "../models/User.js";

const router = Router();

const subscribeSchema = z.object({
  subscription: z.object({
    endpoint: z.string().url(),
    keys: z.object({
      p256dh: z.string(),
      auth: z.string(),
    }),
  }),
});

const unsubscribeSchema = z.object({
  endpoint: z.string().url(),
});

router.post("/subscribe", verifyToken, async (req, res, next) => {
  try {
    const parsed = subscribeSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: "Invalid subscription data" });
    }

    const { endpoint, keys } = parsed.data.subscription;
    const userId = req.user?.userId;

    await Subscription.findOneAndUpdate(
      { endpoint },
      { endpoint, keys, userId },
      { upsert: true, new: true }
    );

    res.json({ success: true });
  } catch (err) {
    next(err);
  }
});

router.post("/unsubscribe", verifyToken, async (req, res, next) => {
  try {
    const parsed = unsubscribeSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: "Invalid data" });
    }

    await Subscription.deleteOne({ endpoint: parsed.data.endpoint });
    res.json({ success: true });
  } catch (err) {
    next(err);
  }
});

router.post("/send", verifyToken, async (req, res, next) => {
  try {
    const userId = req.user?.userId;
    const user = await User.findById(userId);

    if (!user || user.role !== "admin") {
      return res.status(403).json({ error: "Admin access required" });
    }

    const { title, body, url, tag } = req.body;
    if (!title || !body) {
      return res.status(400).json({ error: "Title and body are required" });
    }

    const subscriptions = await Subscription.find();
    let sentCount = 0;

    const webpush = await import("web-push");
    webpush.default.setVapidDetails(
      "mailto:mivoraacedamy@gmail.com",
      process.env.VAPID_PUBLIC_KEY || "",
      process.env.VAPID_PRIVATE_KEY || ""
    );

    for (const sub of subscriptions) {
      try {
        await webpush.default.sendNotification(
          {
            endpoint: sub.endpoint,
            keys: sub.keys,
          },
          JSON.stringify({
            title,
            body,
            url: url || "/",
            tag: tag || "mivora-notification",
          })
        );
        sentCount++;
      } catch {
        await Subscription.deleteOne({ _id: sub._id });
      }
    }

    res.json({ success: true, sent: sentCount });
  } catch (err) {
    next(err);
  }
});

export default router;
