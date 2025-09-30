import express from "express";
import { submitFeedback, getFeedback } from "../controllers/feedbackController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// Patients submit feedback for therapists
router.post("/submit", protect, submitFeedback);

// Therapists get their feedback
router.get("/my-feedback", protect, getFeedback);

export default router;
