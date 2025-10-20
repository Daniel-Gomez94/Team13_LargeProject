import jwt from "jsonwebtoken";
export const requireAuth = (req, _res, next) => {
  const token = (req.headers.authorization || "").replace(/^Bearer\s+/i, "");
  try { req.user = jwt.verify(token, process.env.JWT_SECRET); next(); }
  catch { next({ status: 401, code: "ERR_UNAUTHORIZED", message: "Invalid or missing token" }); }
};
