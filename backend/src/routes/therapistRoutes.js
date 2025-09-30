import express from "express";
import { getTherapists, getPatients, getPatientHistory, getPatientProgress } from "../controllers/therapistController.js";
import { getFeedback } from "../controllers/feedbackController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// Only logged-in patients can view therapists
router.get("/", protect, getTherapists);

// Therapist-only routes
router.get("/patients", protect, getPatients);
router.get("/patients/:id/history", protect, getPatientHistory);
router.get("/patients/:id/progress", protect, getPatientProgress);
router.get("/feedback", protect, getFeedback);

export default router;
