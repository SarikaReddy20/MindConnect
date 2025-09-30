import Feedback from "../models/Feedback.js";

// @desc Submit feedback for a therapist
// @route POST /api/feedback/submit
export const submitFeedback = async (req, res) => {
  const { therapist, rating, comment } = req.body;
  const patient = req.user._id;

  try {
    const feedback = new Feedback({
      patient,
      therapist,
      rating,
      comment,
    });

    await feedback.save();
    res.status(201).json({ message: "Feedback submitted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc Get feedback for the logged-in therapist
// @route GET /api/feedback/my-feedback
export const getFeedback = async (req, res) => {
  try {
    const feedback = await Feedback.find({ therapist: req.user._id }).populate("patient", "name email");
    res.json(feedback);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
