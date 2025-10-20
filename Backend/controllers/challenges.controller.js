import Challenge from "../models/Challenge.js";

export const listChallenges = async (req, res, next) => {
  try {
    const { q, difficulty } = req.query;
    const filter = { isActive: true };
    if (difficulty) filter.difficulty = difficulty;
    if (q) filter.$text = { $search: q }; // optional: add text index on title/prompt
    const items = await Challenge.find(filter).select("-__v").sort({ createdAt: -1 });
    res.json(items);
  } catch (e) { next(e); }
};

export const getChallenge = async (req, res, next) => {
  try {
    const c = await Challenge.findOne({ slug: req.params.slug, isActive: true });
    if (!c) return next({ status: 404, code: "CHALLENGE_NOT_FOUND", message: "Not found" });
    res.json(c);
  } catch (e) { next(e); }
};

// Admin-only create/update/delete would go here if needed.
