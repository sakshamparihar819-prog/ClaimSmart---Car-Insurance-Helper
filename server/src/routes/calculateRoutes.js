import { Router } from "express";
import { calculate } from "../controllers/calculateController.js";
import { optionalAuth } from "../middleware/auth.js";

const router = Router();

router.post("/", optionalAuth, calculate);

export default router;
