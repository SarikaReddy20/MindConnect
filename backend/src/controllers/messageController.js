import Message from "../models/Message.js";

// @desc Get all messages for an appointment
// @route GET /api/messages/:appointmentId
// @access Private
export const getMessages = async (req, res) => {
  try {
    const { appointmentId } = req.params;

    const messages = await Message.find({ appointment: appointmentId })
      .populate("sender", "name role")
      .sort({ createdAt: 1 });

    res.json(messages);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
