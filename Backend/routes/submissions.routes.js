import { Router } from "express";
import { requireAuth } from "../middleware/auth.js";
import { createSubmission, mySubmissions, challengeStatusForMe } from "../controllers/submissions.controller.js";

const r = Router();
r.get("/me", requireAuth, mySubmissions);
r.get("/status/:challengeId", requireAuth, challengeStatusForMe);
r.post("/", requireAuth, createSubmission);
export default r;
