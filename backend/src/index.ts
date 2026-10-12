import "dotenv/config";
import express from "express";
import cors from "cors";
import { connectDB } from "./config/db.js";
import { errorHandler } from "./middleware/errorHandler.js";
import authRoutes from "./routes/auth.js";
import programRoutes from "./routes/programs.js";
import contactRoutes from "./routes/contact.js";
import adminRoutes from "./routes/admin.js";
import sessionRoutes from "./routes/sessions.js";
import eventRoutes from "./routes/events.js";
import settingsRoutes from "./routes/settings.js";
import quoteRoutes from "./routes/quotes.js";
import pushRoutes from "./routes/push.js";
import trialRoutes from "./routes/trial.js";

const app = express();
const PORT = process.env.PORT ?? 3001;

const DEFAULT_ALLOWED_ORIGINS = [
  "http://localhost:5173",
  "http://localhost:3000",
  "http://localhost:4173",
  "http://127.0.0.1:5173",
  "http://127.0.0.1:3000",
  "http://127.0.0.1:4173",
  "https://localhost",
  "capacitor://localhost",
  "https://mivora-academy.vercel.app",
  "https://vyoma-wellness-hub.vercel.app",
  "https://mivora-acedamy.vercel.app",
];

const envOrigins = (process.env.CLIENT_ORIGIN ?? "")
  .split(",")
  .map((o) => o.trim())
  .filter(Boolean);

const allowedOrigins = new Set([...DEFAULT_ALLOWED_ORIGINS, ...envOrigins]);

function isAllowedOrigin(origin: string): boolean {
  if (allowedOrigins.has(origin)) return true;
  // Match any Vercel domain for Mivora / Vyoma or team preview deployments
  if (/^https:\/\/(vyoma-wellness-hub|mivora-academy|mivora-acedamy)[a-z0-9-]*\.vercel\.app$/i.test(origin)) {
    return true;
  }
  if (/^https:\/\/[a-z0-9-]+-jay-harish-ps-projects\.vercel\.app$/i.test(origin)) {
    return true;
  }
  // Match localhost / 127.0.0.1 on any port
  if (/^http:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/i.test(origin)) {
    return true;
  }
  return false;
}

const corsOptions: cors.CorsOptions = {
  origin: function (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) {
    if (!origin || isAllowedOrigin(origin)) {
      callback(null, true);
    } else {
      console.warn("[CORS Blocked] Origin:", origin);
      callback(null, false);
    }
  },
  credentials: true,
  optionsSuccessStatus: 200,
};
app.use(cors(corsOptions));
app.options("*", cors(corsOptions));
app.use(express.json());

app.get("/", (_req, res) => {
  res.json({ success: true, message: "Mivora Academy API running" });
});

app.get("/health", (_req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

app.use("/api/auth", authRoutes);
app.use("/api/programs", programRoutes);
app.use("/api/contact", contactRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/sessions", sessionRoutes);
app.use("/api/events", eventRoutes);
app.use("/api/settings", settingsRoutes);
app.use("/api/quotes", quoteRoutes);
app.use("/api/push", pushRoutes);
app.use("/api/trial", trialRoutes);

app.use(errorHandler);

const server = app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  connectDB();
});
