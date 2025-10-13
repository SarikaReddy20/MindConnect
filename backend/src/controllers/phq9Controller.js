import PHQ9 from "../models/PHQ9.js";
import { Document, Packer, Paragraph, TextRun } from "docx";

// @desc Submit PHQ-9 answers
// @route POST /api/phq9
export const submitPHQ9 = async (req, res) => {
  try {
    const { answers } = req.body;

    if (!answers || answers.length !== 9)
      return res.status(400).json({ message: "9 answers are required" });

    const score = answers.reduce((acc, val) => acc + val, 0);

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

// @desc Download PHQ-9 result as Word document
// @route GET /api/phq9/download/:id
export const downloadPHQ9Report = async (req, res) => {
  try {
    const { id } = req.params;
    const record = await PHQ9.findById(id).populate("patient", "name email");

    if (!record) return res.status(404).json({ message: "PHQ-9 record not found" });

    // ✅ Create the Word document
    const doc = new Document({
      sections: [
        {
          properties: {},
          children: [
            new Paragraph({
              children: [
                new TextRun({
                  text: "PHQ-9 Evaluation Report",
                  bold: true,
                  size: 32,
                }),
              ],
            }),
            new Paragraph({ text: "" }),
            new Paragraph({ text: `Patient Name: ${record.patient.name}` }),
            new Paragraph({ text: `Email: ${record.patient.email}` }),
            new Paragraph({ text: `Date: ${new Date(record.createdAt).toLocaleString()}` }),
            new Paragraph({ text: "" }),
            new Paragraph({ text: `Total Score: ${record.score}` }),
            new Paragraph({ text: `Severity: ${record.result}` }),
            new Paragraph({ text: "" }),
            new Paragraph({
              text: "Answers:",
              bold: true,
            }),
            ...record.answers.map(
              (a, i) => new Paragraph({ text: `Q${i + 1}: ${a}` })
            ),
          ],
        },
      ],
    });

    // ✅ Convert doc to a buffer
    const buffer = await Packer.toBuffer(doc);

    // ✅ Set headers for Word download
    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    );
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=PHQ9_Report_${record._id}.docx`
    );

    // ✅ Send buffer
    res.send(buffer);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error generating PHQ-9 report" });
  }
};
