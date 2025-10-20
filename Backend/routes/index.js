import { Router } from "express";
import auth from "./auth.routes.js";
import users from "./users.routes.js";
import challenges from "./challenges.routes.js";
import submissions from "./submissions.routes.js";

const r = Router();
r.use("/auth", auth);
r.use("/users", users);
r.use("/challenges", challenges);
r.use("/submissions", submissions);
export default r;
