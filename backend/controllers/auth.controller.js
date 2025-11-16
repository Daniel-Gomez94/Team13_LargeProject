import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import Verification from "../models/Verification.js";
import PasswordReset from "../models/PasswordReset.js";
import { hash, randomToken, nowPlusMinutes } from "../utils/crypto.js";
import { sendVerificationCode, sendPasswordReset } from "../utils/email.js";

// helper
const sign = (payload, exp=process.env.JWT_EXPIRES) =>
  jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: exp });

export const register = async (req, res, next) => {
  try {
    const { email, handle, password } = req.body;
    const exists = await User.findOne({ $or: [ { email }, { handle } ] });
    if (exists) return next({ status: 409, code: "USER_EXISTS", message: "Email or handle already used" });

    const passwordHash = await bcrypt.hash(password, 12);
    const user = await User.create({ email, handle, passwordHash, verified: false, score: 0 });

    // create & email a 6-digit PIN
    const code = (Math.floor(100000 + Math.random()*900000)).toString();
    await Verification.create({
      userId: user._id, codeHash: hash(code),
      expiresAt: nowPlusMinutes(15)
    });
    await sendVerificationCode(email, code);

    const access = sign({ id: user._id, role: "user" });
    res.status(201).json({ user: { id: user._id, email, handle, verified: user.verified }, access, note: "PIN sent (dev: code in logs?)" });
  } catch (e) { next(e); }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return next({ status: 401, code: "BAD_CREDENTIALS", message: "Invalid email/password" });
    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) return next({ status: 401, code: "BAD_CREDENTIALS", message: "Invalid email/password" });
    const access = sign({ id: user._id, role: "user" });
    res.json({ access, user: { id: user._id, email: user.email, handle: user.handle, verified: user.verified, score: user.score }});
  } catch (e) { next(e); }
};

export const verifyEmail = async (req, res, next) => {
  try {
    const { email, code } = req.body;
    const user = await User.findOne({ email });
    if (!user) return next({ status: 404, code: "USER_NOT_FOUND", message: "User not found" });

    const doc = await Verification.findOne({ userId: user._id, codeHash: hash(code) });
    if (!doc || doc.expiresAt < new Date()) return next({ status: 400, code: "BAD_CODE", message: "Invalid or expired code" });

    user.verified = true;
    await user.save();
    await Verification.deleteMany({ userId: user._id }); // clean up
    res.json({ ok: true, verified: true });
  } catch (e) { next(e); }
};

export const requestPasswordReset = async (req, res, next) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    // Always respond OK to avoid user enumeration
    if (!user) return res.json({ ok: true });

    const token = randomToken(32);
    await PasswordReset.create({
      userId: user._id,
      tokenHash: hash(token),
      expiresAt: nowPlusMinutes(30)
    });
    await sendPasswordReset(email, token);
    res.json({ ok: true });
  } catch (e) { next(e); }
};

export const resetPassword = async (req, res, next) => {
  try {
    const { token, password } = req.body;
    const pr = await PasswordReset.findOne({ tokenHash: hash(token) });
    if (!pr || pr.expiresAt < new Date()) return next({ status: 400, code: "BAD_TOKEN", message: "Invalid or expired token" });

    const user = await User.findById(pr.userId);
    if (!user) return next({ status: 404, code: "USER_NOT_FOUND", message: "User not found" });

    user.passwordHash = await bcrypt.hash(password, 12);
    await user.save();
    await PasswordReset.deleteMany({ userId: user._id });
    res.json({ ok: true });
  } catch (e) { next(e); }
};
