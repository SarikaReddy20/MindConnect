import express from "express";
import { getMessages } from "../controllers/messageController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/:appointmentId", protect, getMessages);

export default router;
