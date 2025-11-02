import Submission from "../models/Submission.js";
import User from "../models/User.js";

export const createSubmission = async (req, res, next) => {
  try {
    const { challengeId, passed } = req.body;
    const sub = await Submission.create({ userId: req.user.id, challengeId, passed });

    // Example scoring rule: +10 when you pass a challenge for the **first** time
    if (passed) {
      const priorPass = await Submission.exists({ userId: req.user.id, challengeId, passed: true, _id: { $ne: sub._id } });
      if (!priorPass) {
        await User.updateOne({ _id: req.user.id }, { $inc: { score: 10 } });
      }
    }
    res.status(201).json(sub);
  } catch (e) { next(e); }
};

export const mySubmissions = async (req, res, next) => {
  try {
    const list = await Submission
      .find({ userId: req.user.id })
      .sort({ createdAt: -1 })
      .limit(200);
    res.json(list);
  } catch (e) { next(e); }
};

export const challengeStatusForMe = async (req, res, next) => {
  try {
    const { challengeId } = req.params;
    const passed = await Submission.exists({ userId: req.user.id, challengeId, passed: true });
    res.json({ challengeId, passed: !!passed });
  } catch (e) { next(e); }
};
