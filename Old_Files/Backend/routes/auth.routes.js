import { Router } from "express";
import { validate } from "../middleware/validate.js";
import { registerSchema, loginSchema, verifySchema, requestResetSchema, resetSchema } from "../validators/auth.schemas.js";
import { register, login, verifyEmail, requestPasswordReset, resetPassword } from "../controllers/auth.controller.js";

const r = Router();
r.post("/register", validate(registerSchema), register);
r.post("/login", validate(loginSchema), login);
r.post("/verify", validate(verifySchema), verifyEmail);
r.post("/request-reset", validate(requestResetSchema), requestPasswordReset);
r.post("/reset", validate(resetSchema), resetPassword);
export default r;
