import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true, index: true },
  handle: { type: String, required: true, unique: true, index: true },
  passwordHash: { type: String, required: true },
  score: { type: Number, default: 0, index: -1 },
  verified: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});
userSchema.index({ score: -1 }); // leaderboard

export default mongoose.model("User", userSchema);
