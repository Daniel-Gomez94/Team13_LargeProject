import mongoose from "mongoose";
const { ObjectId } = mongoose.Schema.Types;

const submissionSchema = new mongoose.Schema({
  userId: { type: ObjectId, ref: "User", required: true, index: true },
  challengeId: { type: ObjectId, ref: "Challenge", required: true, index: true },
  passed: { type: Boolean, required: true },
  createdAt: { type: Date, default: Date.now }
});

submissionSchema.index({ challengeId: 1, userId: 1 }); // for per-user/per-challenge lookups
submissionSchema.index({ passed: 1 });

export default mongoose.model("Submission", submissionSchema);
