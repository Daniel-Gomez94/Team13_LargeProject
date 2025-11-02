import crypto from "crypto";
export const hash = (v) => crypto.createHash("sha256").update(String(v)).digest("hex");
export const randomToken = (bytes=32) => crypto.randomBytes(bytes).toString("hex");
export const nowPlusMinutes = (m) => new Date(Date.now() + m*60*1000);
