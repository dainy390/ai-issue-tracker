const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken'); 
const issueController = require('../controllers/issueController');


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

// Apply auth to all routes
router.use(auth);

// Issue Routes
router.post('/', issueController.createIssue);
router.get('/project/:projectId', issueController.getProjectIssues);
router.get('/:id', issueController.getIssueById);
router.patch('/:id/status', issueController.updateIssueStatus);
router.put('/:id', issueController.editIssue);
router.delete('/:id', issueController.deleteIssue);

// Comment & Log Routes
router.post('/:id/comments', issueController.addComment);
router.get('/:id/comments', issueController.getComments);
router.get('/:id/logs', issueController.getActivityLogs);

module.exports = router;