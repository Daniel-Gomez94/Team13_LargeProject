import express from "express";
import helmet from "helmet";
import cors from "cors";
import compression from "compression";
import morgan from "morgan";
import "dotenv/config";
import mongoose from "mongoose";

import api from "./routes/index.js";
import { notFound } from "./middleware/notFound.js";
import { errorHandler } from "./middleware/error.js";

/* -------- Env sanity checks -------- */
const requiredEnv = ["MONGODB_URI", "JWT_SECRET"];//This is used to check the env files have the correct info
for (const k of requiredEnv) {
  if (!process.env[k]) {
    console.error(`[BOOT] Missing required env var: ${k}`);
  }
}

/* -------- App & middleware -------- */
const app = express();
app.disable("x-powered-by");
app.set("trust proxy", true); // if behind nginx/proxy

// allow single origin or comma-separated list in CLIENT_ORIGIN
const allowedOrigins =
  (process.env.CLIENT_ORIGIN && process.env.CLIENT_ORIGIN.split(",").map(s => s.trim()).filter(Boolean)) || true;

app.use(helmet());
app.use(cors({ origin: allowedOrigins, credentials: true }));
app.use(compression());
app.use(express.json({ limit: "1mb" }));
app.use(morgan(process.env.NODE_ENV === "production" ? "combined" : "dev"));

/* -------- Health / readiness -------- */
app.get("/healthz", (_req, res) => res.json({ ok: true }));
app.get("/readyz", (_req, res) => {
  const state = mongoose.connection.readyState; // 1 = connected
  res.status(state === 1 ? 200 : 503).json({ mongoConnected: state === 1 });
});

/* -------- Routes -------- */
app.use("/api", api);

/* -------- 404 + error handler -------- */
app.use(notFound);
app.use(errorHandler);

/* -------- Mongo connect & server start -------- */
mongoose.set("strictQuery", true);

try {
  await mongoose.connect(process.env.MONGODB_URI, { serverSelectionTimeoutMS: 8000 });
  console.log("[BOOT] Connected to MongoDB");
} catch (err) {
  console.error("[BOOT] MongoDB connection failed:", err.message);
  process.exit(1);
}

const port = Number(process.env.PORT) || 4000;
const server = app.listen(port, () => {
  console.log(`API listening on :${port} (env: ${process.env.NODE_ENV || "development"})`);
});

/* -------- Graceful shutdown -------- */
const shutdown = (signal) => {
  console.log(`[SHUTDOWN] ${signal} received, closing server...`);
  server.close(async () => {
    try {
      await mongoose.connection.close();
      console.log("[SHUTDOWN] MongoDB connection closed. Bye!");
      process.exit(0);
    } catch (e) {
      console.error("[SHUTDOWN] Error during shutdown:", e);
      process.exit(1);
    }
  });
};

process.on("SIGINT", () => shutdown("SIGINT"));
process.on("SIGTERM", () => shutdown("SIGTERM"));
process.on("unhandledRejection", (reason) => {
  console.error("[FATAL] Unhandled Promise Rejection:", reason);
});
process.on("uncaughtException", (err) => {
  console.error("[FATAL] Uncaught Exception:", err);
  shutdown("uncaughtException");
});
