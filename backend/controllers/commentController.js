const Comment = require('../models/comment');
const Issue = require('../models/issue');
const ActivityLog = require('../models/ActivityLog');

exports.createComment = async (req, res) => {
  try {
    const { issueId, commentText } = req.body;
    const userId = req.user.id; 

   //comment save in database
    const newComment = new Comment({
      issueId,
      userId,
      commentText
    });
    await newComment.save();

 
    const populatedComment = await newComment.populate('userId', 'name');

    // ---WEBSOCKET TRIGGER ADD ---
    
    // Express app  'socketio' instance 
    const io = req.app.get('socketio');
    
  
    io.to(issueId.toString()).emit('new_comment', populatedComment);

    // --- WEBSOCKET TRIGGER END ---

    await ActivityLog.create({
      issueId,
      action: `added a comment: "${commentText.substring(0, 20)}..."`,
      userId
    });

    res.status(201).json(populatedComment);
  } catch (error) {
    res.status(500).json({ message: "Error adding comment", error: error.message });
  }
};