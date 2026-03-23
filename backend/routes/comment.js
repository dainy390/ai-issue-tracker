const express = require("express");
const Comment = require("../models/comment");
const Activity = require("../models/Activity");
const auth = require("../middleware/auth");
const router = express.Router();

// Get comments
router.get("/issue/:id", auth, async (req, res) => {
  const comments = await Comment.find({ issueId: req.params.id }).populate("userId", "name");
  res.json(comments);
});

// Add comment
router.post("/", auth, async (req, res) => {
  const comment = new Comment({ ...req.body, userId: req.user.id });
  await comment.save();
  await new Activity({ issueId: comment.issueId, action: "Comment added", userId: req.user.id }).save();
  res.status(201).json(comment);
});

// Delete comment
router.delete("/:id", auth, async (req, res) => {
  const comment = await Comment.findById(req.params.id);
  if (comment.userId.toString() !== req.user.id) return res.status(403).json({ message: "Not allowed" });
  await comment.deleteOne();
  res.json({ message: "Comment deleted" });
});

module.exports = router;