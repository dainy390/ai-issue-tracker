const Activity = require("../models/Activity");

// @desc    Get activity logs for an issue
exports.getActivity = async (req, res) => {
  try {
    const activities = await Activity.find({ issueId: req.params.issueId }).populate("userId", "name");
    res.status(200).json(activities);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};