const Activity = require("../models/Activity");

const logActivity = async ({ issueId, userId, action }) => {
  try {
    await Activity.create({ issueId, userId, action });
  } catch (err) {
    console.error("Activity log error:", err.message);
  }
};

module.exports = logActivity;