const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
  issueId: { type: mongoose.Schema.Types.ObjectId, ref: 'Issue', required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  commentText: { type: String, required: true }
}, { timestamps: true });

module.exports = mongoose.models.Comment || mongoose.model('Comment', commentSchema);