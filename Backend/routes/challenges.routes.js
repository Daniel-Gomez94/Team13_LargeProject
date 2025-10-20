import { Router } from "express";
import { listChallenges, getChallenge } from "../controllers/challenges.controller.js";
const r = Router();
r.get("/", listChallenges);
r.get("/:slug", getChallenge);
export default r;
