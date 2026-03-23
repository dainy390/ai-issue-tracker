const Issue = require('../models/issue');
const Comment = require('../models/comment');
const ActivityLog = require('../models/ActivityLog');
const { logActivity } = require('../services/activityService');

exports.createIssue = async (req, res) => {
  try {
    const { title, description, projectId, priority, dueDate, tags } = req.body;
    const newIssue = await Issue.create({
      title, description, projectId, priority, dueDate, tags, createdBy: req.user.id
    });
    
    await logActivity(newIssue._id, req.user.id, 'created the issue');

    // Socket.io Trigger
    const io = req.app.get('socketio');
    if (io) {
      io.to(projectId.toString()).emit('issue_created', newIssue);
    }

    res.status(201).json(newIssue);
  } catch (error) {
    res.status(500).json({ message: 'Error creating issue', error: error.message });
  }
};

exports.getProjectIssues = async (req, res) => {
  try {
    const issues = await Issue.find({ projectId: req.params.projectId })
      .populate('assignedTo', 'name')
      .populate('createdBy', 'name');
    res.status(200).json(issues);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching issues' });
  }
};

exports.getIssueById = async (req, res) => {
  try {
    const issue = await Issue.findById(req.params.id)
      .populate('assignedTo', 'name')
      .populate('createdBy', 'name');
    res.status(200).json(issue);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching issue' });
  }
};

exports.updateIssueStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const issue = await Issue.findByIdAndUpdate(req.params.id, { status }, { new: true });
    
    await logActivity(issue._id, req.user.id, `changed status to ${status}`);

    
    const io = req.app.get('socketio');
    if (io) {
      io.to(issue._id.toString()).emit('status_updated', issue);
    }

    res.status(200).json(issue);
  } catch (error) {
    res.status(500).json({ message: 'Error updating status' });
  }
};

exports.editIssue = async (req, res) => {
  try {
    const { title, description, priority, status, assignedTo, dueDate, tags } = req.body;
    const updatedIssue = await Issue.findByIdAndUpdate(
      req.params.id,
      { title, description, priority, status, assignedTo, dueDate, tags },
      { new: true }
    );
    if (!updatedIssue) return res.status(404).json({ message: 'Issue not found' });
    
    await logActivity(updatedIssue._id, req.user.id, 'updated the issue details');

    // Socket.io Trigger
    const io = req.app.get('socketio');
    if (io) {
      io.to(updatedIssue._id.toString()).emit('issue_updated', updatedIssue);
    }

    res.status(200).json(updatedIssue);
  } catch (error) {
    res.status(500).json({ message: 'Error editing issue' });
  }
};

exports.deleteIssue = async (req, res) => {
  try {
    const issueId = req.params.id;
    const deletedIssue = await Issue.findByIdAndDelete(issueId);
    if (!deletedIssue) return res.status(404).json({ message: 'Issue not found' });

    await Comment.deleteMany({ issueId });
    await ActivityLog.deleteMany({ issueId });

    res.status(200).json({ message: 'Issue deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting issue' });
  }
};

exports.addComment = async (req, res) => {
  try {
    const { commentText } = req.body;
    const newComment = await Comment.create({
      issueId: req.params.id,
      userId: req.user.id,
      commentText
    });
    
    const populatedComment = await newComment.populate('userId', 'name');
    await logActivity(req.params.id, req.user.id, 'added a comment');

   
    const io = req.app.get('socketio');
    if (io) {
      io.to(req.params.id.toString()).emit('new_comment', populatedComment);
    }

    res.status(201).json(populatedComment);
  } catch (error) {
    res.status(500).json({ message: 'Error adding comment' });
  }
};

exports.getComments = async (req, res) => {
  try {
    const comments = await Comment.find({ issueId: req.params.id }).populate('userId', 'name');
    res.status(200).json(comments);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching comments' });
  }
};

exports.deleteComment = async (req, res) => {
  try {
    const commentId = req.params.commentId;
    const comment = await Comment.findById(commentId);
    if (!comment) return res.status(404).json({ message: 'Comment not found' });

    if (comment.userId.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to delete this comment' });
    }

    await Comment.findByIdAndDelete(commentId);
    await logActivity(comment.issueId, req.user.id, 'deleted a comment');
    res.status(200).json({ message: 'Comment deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting comment' });
  }
};

exports.getActivityLogs = async (req, res) => {
  try {
    const logs = await ActivityLog.find({ issueId: req.params.id }).populate('userId', 'name').sort({ createdAt: -1 });
    res.status(200).json(logs);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching logs' });
  }
};