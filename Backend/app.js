import express from "express";
import helmet from "helmet";
import cors from "cors";
import compression from "compression";
import morgan from "morgan";
import mongoose from "mongoose";

import api from "./routes/index.js";
import { notFound } from "./middleware/notFound.js";
import { errorHandler } from "./middleware/error.js";

export const requiredEnv = ["MONGODB_URI", "JWT_SECRET"];

const buildAllowedOrigins = () => {
  // Support comma-separated CLIENT_ORIGIN values; default to allowing all origins in dev
  if (!process.env.CLIENT_ORIGIN) return true;
  return process.env.CLIENT_ORIGIN
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
};

const app = express();
app.disable("x-powered-by");
app.set("trust proxy", true);

const allowedOrigins = buildAllowedOrigins();

app.use(helmet());
app.use(cors({ origin: allowedOrigins, credentials: true }));
app.use(compression());
app.use(express.json({ limit: "1mb" }));
app.use(morgan(process.env.NODE_ENV === "production" ? "combined" : "dev"));

app.get("/healthz", (_req, res) => res.json({ ok: true }));
app.get("/readyz", (_req, res) => {
  const state = mongoose.connection.readyState;
  res.status(state === 1 ? 200 : 503).json({ mongoConnected: state === 1 });
});

app.use("/api", api);

app.use(notFound);
app.use(errorHandler);

export default app;
