import mongoose from "mongoose";

const challengeSchema = new mongoose.Schema({
  title: { type: String, required: true },
  slug:  { type: String, required: true, unique: true, index: true },
  prompt: { type: String, required: true },
  sampleOutput: { type: String, required: true },
  difficulty: { type: String, enum: ["easy","medium","hard"], required: true },
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now }
});

challengeSchema.index({ slug: 1 }, { unique: true });

export default mongoose.model("Challenge", challengeSchema);
