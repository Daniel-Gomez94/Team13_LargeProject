import "dotenv/config";
import mongoose from "mongoose";

import app, { requiredEnv } from "./app.js";

/* -------- Env sanity checks -------- */
for (const k of requiredEnv) {
  if (!process.env[k]) {
    console.error(`[BOOT] Missing required env var: ${k}`);
  }
}

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
