const mongoose = require('mongoose');
const IssueSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  projectId: { type: mongoose.Schema.Types.ObjectId, ref: 'Project', required: true },
  priority: { type: String, enum: ['Low', 'Medium', 'High', 'Critical'], default: 'Medium' },
  status: { type: String, enum: ['Todo', 'In Progress', 'Done'], default: 'Todo' },
  assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  dueDate: { type: Date }, 
  tags: [{ type: String }], 
  createdAt: { type: Date, default: Date.now }
});
module.exports = mongoose.model('Issue', IssueSchema);