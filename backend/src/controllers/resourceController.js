import Resource from "../models/Resource.js";
import Journal from "../models/Journal.js";

// @desc Get all self-help resources
// @route GET /api/resources
export const getResources = async (req, res) => {
  try {
    const resources = await Resource.find().sort({ createdAt: -1 });
    res.json(resources);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc Add journal entry
// @route POST /api/journal
export const addJournal = async (req, res) => {
  try {
    const { mood, note } = req.body;

    if (!mood) return res.status(400).json({ message: "Mood is required" });

    const journal = await Journal.create({
      patient: req.user._id,
      mood,
      note,
    });

    res.status(201).json(journal);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc Get patient journal entries
// @route GET /api/journal
export const getJournal = async (req, res) => {
  try {
    const entries = await Journal.find({ patient: req.user._id }).sort({ createdAt: -1 });
    res.json(entries);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
