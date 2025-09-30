import express from "express";
import { submitPHQ9, getPHQ9Results } from "../controllers/phq9Controller.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", protect, submitPHQ9);
router.get("/", protect, getPHQ9Results);

export default router;
