const ActivityLog = require('../models/ActivityLog');

exports.logActivity = async (issueId, userId, action) => {
  try {
    // We check if models are loaded just like we did to fix the other error!
    const Model = require('mongoose').models.ActivityLog || ActivityLog;
    await Model.create({ issueId, userId, action });
  } catch (error) {
    console.error('Failed to log activity:', error);
  }
};