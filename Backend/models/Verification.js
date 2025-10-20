import mongoose from "mongoose";
const { ObjectId } = mongoose.Schema.Types;

const verificationSchema = new mongoose.Schema({
  userId: { type: ObjectId, ref: "User" }, // may be null before user exists
  // store *hash* of code for security:
  codeHash: { type: String, required: true, index: true },
  createdAt: { type: Date, default: Date.now },
  expiresAt: { type: Date, required: true, index: true }
});
// TTL: expire at expiresAt
verificationSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });
verificationSchema.index({ userId: 1, codeHash: 1 });

export default mongoose.model("Verification", verificationSchema);
