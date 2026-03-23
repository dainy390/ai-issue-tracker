const mongoose = require("mongoose");

const aiSummarySchema = new mongoose.Schema({
  issueId: { type: mongoose.Schema.Types.ObjectId, ref: "Issue", required: true },
  discussionSummary: String,
  keyActions: [String],
  recommendedNextSteps: [String]
}, { timestamps: true });

module.exports = mongoose.model("AISummary", aiSummarySchema);