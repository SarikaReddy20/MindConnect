import PHQ9 from "../models/PHQ9.js";

// @desc Submit PHQ-9 answers
// @route POST /api/phq9
export const submitPHQ9 = async (req, res) => {
  try {
    const { answers } = req.body;

    if (!answers || answers.length !== 9)
      return res.status(400).json({ message: "9 answers are required" });

    // Calculate score
    const score = answers.reduce((acc, val) => acc + val, 0);

    // Determine result based on standard PHQ-9 interpretation
    let result = "";
    if (score <= 4) result = "Minimal";
    else if (score <= 9) result = "Mild";
    else if (score <= 14) result = "Moderate";
    else if (score <= 19) result = "Moderately Severe";
    else result = "Severe";

    const phq9 = await PHQ9.create({
      patient: req.user._id,
      answers,
      score,
      result,
    });

    res.status(201).json(phq9);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc Get all PHQ-9 results for logged-in patient
// @route GET /api/phq9
export const getPHQ9Results = async (req, res) => {
  try {
    const results = await PHQ9.find({ patient: req.user._id }).sort({ createdAt: -1 });
    res.json(results);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
