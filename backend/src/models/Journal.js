import mongoose from "mongoose";

const journalSchema = new mongoose.Schema(
  {
    patient: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    mood: { type: String, enum: ["Happy", "Neutral", "Sad"], required: true },
    note: { type: String },
  },
  { timestamps: true }
);

const Journal = mongoose.model("Journal", journalSchema);

export default Journal;
