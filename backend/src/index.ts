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

const app = express();
const PORT = process.env.PORT ?? 3001;
const CLIENT_ORIGINS = (
  process.env.CLIENT_ORIGIN ??
  "http://localhost:5173,https://localhost,capacitor://localhost,https://vyoma-wellness-hub.vercel.app"
).split(",");

const corsOptions = {
  origin: function (origin: string | undefined, callback: any) {
    if (!origin || CLIENT_ORIGINS.includes(origin)) {
      callback(null, true);
    } else {
      console.log("Blocked by CORS:", origin);
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
  optionsSuccessStatus: 200,
};
app.use(cors(corsOptions));
app.options("*", cors(corsOptions));
app.use(express.json());

app.get("/", (_req, res) => {
  res.json({ success: true, message: "Vyoma API running" });
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

app.use(errorHandler);

async function start() {
  await connectDB();
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

start();
