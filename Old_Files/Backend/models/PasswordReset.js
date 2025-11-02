import mongoose from "mongoose";
const { ObjectId } = mongoose.Schema.Types;

const passwordResetSchema = new mongoose.Schema({
  userId: { type: ObjectId, ref: "User", required: true, index: true },
  tokenHash: { type: String, required: true, unique: true },
  createdAt: { type: Date, default: Date.now },
  expiresAt: { type: Date, required: true, index: true }
});
passwordResetSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export default mongoose.model("PasswordReset", passwordResetSchema);
