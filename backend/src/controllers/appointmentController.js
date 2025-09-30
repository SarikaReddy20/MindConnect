import Appointment from "../models/Appointment.js";

// @desc Book appointment
// @route POST /api/appointments
export const bookAppointment = async (req, res) => {
  try {
    const { therapistId, date } = req.body;

    if (!therapistId || !date) {
      return res.status(400).json({ message: "Therapist and date are required" });
    }

    const appointment = await Appointment.create({
      patient: req.user._id,
      therapist: therapistId,
      date,
    });

    res.status(201).json(appointment);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc Get appointments for logged-in user
// @route GET /api/appointments
export const getAppointments = async (req, res) => {
  try {
    let query = {};

    if (req.user.role === "patient") query.patient = req.user._id;
    if (req.user.role === "therapist") query.therapist = req.user._id;

    const appointments = await Appointment.find(query)
      .populate("patient", "name email")
      .populate("therapist", "name email");

    res.json(appointments);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc Cancel appointment
// @route PUT /api/appointments/:id/cancel
export const cancelAppointment = async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id);

    if (!appointment) return res.status(404).json({ message: "Appointment not found" });

    // Only patient or therapist involved can cancel
    if (
      appointment.patient.toString() !== req.user._id.toString() &&
      appointment.therapist.toString() !== req.user._id.toString()
    ) {
      return res.status(401).json({ message: "Not authorized to cancel" });
    }

    appointment.status = "cancelled";
    await appointment.save();

    res.json({ message: "Appointment cancelled" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
