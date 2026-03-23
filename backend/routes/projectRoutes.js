const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');

const Project = require('../models/project'); 
const Issue = require('../models/issue'); 


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

//  Get All Projects
router.get('/', async (req, res) => {
  try {
    const projects = await Project.find({
      $or: [{ owner: req.user.id }, { members: req.user.id }]
    });
    res.json(projects);
  } catch (error) {
    res.status(500).json({ message: "Error fetching projects" });
  }
});

//  Create Project
router.post('/', async (req, res) => {
  try {
    const { projectName, description } = req.body;
    const project = await Project.create({
      projectName,
      description,
      owner: req.user.id, 
      members: [req.user.id] 
    });
    res.status(201).json(project);
  } catch (error) {
    res.status(500).json({ message: "Error creating project" });
  }
});

//  DELETE PROJECT 
router.delete('/:id', async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ message: 'Project not found' });

    // Check if user is the actual owner
    if (project.owner.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to delete' });
    }

    // Project delete 
    await Project.findByIdAndDelete(req.params.id);
    
    
    await Issue.deleteMany({ projectId: req.params.id });

    res.json({ message: 'Project deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: "Error deleting project" });
  }
});

module.exports = router;