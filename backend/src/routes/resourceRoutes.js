import express from "express";
import { getResources, addJournal, getJournal } from "../controllers/resourceController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// Resources
router.get("/resources", protect, getResources);

// Journaling
router.post("/journal", protect, addJournal);
router.get("/journal", protect, getJournal);

export default router;
