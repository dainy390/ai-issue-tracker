const mongoose = require('mongoose');

const activityLogSchema = new mongoose.Schema({
  issueId: { type: mongoose.Schema.Types.ObjectId, ref: 'Issue', required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  action: { type: String, required: true }
}, { timestamps: true });

module.exports = mongoose.models.ActivityLog || mongoose.model('ActivityLog', activityLogSchema);