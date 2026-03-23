const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const aiController = require('../controllers/aiController');

// --- IN-FILE MIDDLEWARE (Module Not Found Error Fix) ---
const auth = (req, res, next) => {
  const authHeader = req.header('Authorization');
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) return res.status(401).json({ message: 'No token, access denied' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ message: 'Invalid token' });
  }
};

// Route ko secure karein is naye middleware se
router.use(auth);

// AI Summarize Route
router.post('/summarize', aiController.generateSummary);

module.exports = router;