import mongoose from "mongoose";

const phq9Schema = new mongoose.Schema(
  {
    patient: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    answers: [{ type: Number, required: true }], // 9 answers, each 0-3
    score: { type: Number, required: true },
    result: { type: String, required: true }, // e.g., "Minimal", "Moderate"
  },
  { timestamps: true }
);

const PHQ9 = mongoose.model("PHQ9", phq9Schema);

export default PHQ9;
