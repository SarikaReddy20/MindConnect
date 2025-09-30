import User from "../models/User.js";
import Appointment from "../models/Appointment.js";
import PHQ9 from "../models/PHQ9.js";
import Journal from "../models/Journal.js";
import Message from "../models/Message.js";

// @desc Get all therapists
// @route GET /api/therapists
export const getTherapists = async (req, res) => {
  try {
    const therapists = await User.find({ role: "therapist" }).select("_id name email");
    res.json(therapists);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getPatients = async (req, res) => {
  if (req.user.role !== 'therapist') {
    return res.status(403).json({ message: 'Access denied' });
  }

  try {
    const appointments = await Appointment.find({ therapist: req.user._id }).populate("patient", "name email");
    const patients = appointments.map(app => app.patient);
    // Remove duplicates
    const uniquePatients = patients.filter((patient, index, self) =>
      index === self.findIndex(p => p._id.toString() === patient._id.toString())
    );
    res.json(uniquePatients);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getPatientHistory = async (req, res) => {
  if (req.user.role !== 'therapist') {
    return res.status(403).json({ message: 'Access denied' });
  }

  const { id } = req.params;
  try {
    const phq9 = await PHQ9.find({ patient: id }).sort({ createdAt: -1 });
    const journals = await Journal.find({ patient: id }).sort({ createdAt: -1 });
    const messages = await Message.find({ appointment: { $in: await Appointment.find({ patient: id, therapist: req.user._id }).select("_id") } }).populate("sender", "name").sort({ createdAt: -1 });
    res.json({ phq9, journals, messages });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getPatientProgress = async (req, res) => {
  if (req.user.role !== 'therapist') {
    return res.status(403).json({ message: 'Access denied' });
  }

  const { id } = req.params;
  try {
    const phq9Scores = await PHQ9.find({ patient: id }).select("score createdAt").sort({ createdAt: 1 });
    res.json(phq9Scores);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
