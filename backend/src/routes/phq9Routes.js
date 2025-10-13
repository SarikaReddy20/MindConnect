import express from "express";
import { submitPHQ9, getPHQ9Results, downloadPHQ9Report } from "../controllers/phq9Controller.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", protect, submitPHQ9);
router.get("/", protect, getPHQ9Results);
router.get("/download/:id", protect, downloadPHQ9Report);

export default router;
