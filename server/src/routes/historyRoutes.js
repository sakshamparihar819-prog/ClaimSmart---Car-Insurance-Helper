import { Router } from "express";
import { clearHistory, deleteHistoryItem, getHistoryItem, listHistory } from "../controllers/historyController.js";
import { protect } from "../middleware/auth.js";

const router = Router();

router.use(protect); // every history route needs a logged-in user

router.get("/", listHistory);
router.delete("/", clearHistory);
router.get("/:id", getHistoryItem);
router.delete("/:id", deleteHistoryItem);

export default router;
