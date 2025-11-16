import User from "../models/User.js";
export const me = async (req, res, next) => {
  try {
    const u = await User.findById(req.user.id).select("-passwordHash");
    if (!u) return next({ status: 404, code: "USER_NOT_FOUND", message: "User not found" });
    res.json(u);
  } catch (e) { next(e); }
};

export const leaderboard = async (_req, res, next) => {
  try {
    const top = await User.find().select("handle score").sort({ score: -1 }).limit(50);
    res.json(top);
  } catch (e) { next(e); }
};
