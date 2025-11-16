import { Router } from "express";
import { requireAuth } from "../middleware/auth.js";
import { me, leaderboard } from "../controllers/users.controller.js";

const r = Router();
r.get("/me", requireAuth, me);
r.get("/leaderboard", leaderboard);
export default r;
