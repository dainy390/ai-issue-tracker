const express = require("express");
const router = express.Router();
const Activity = require("../models/ActivityLog");

// GET activity by issue
router.get("/:issueId", async (req, res) => {
  try {
    const logs = await Activity.find({ issueId: req.params.issueId })
      .populate("userId", "name")
      .sort({ timestamp: -1 });

    res.json(logs);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;