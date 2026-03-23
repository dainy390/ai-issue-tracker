const Project = require('../models/project');

exports.createProject = async (req, res) => {
  try {
    const { projectName, description } = req.body;
    const newProject = await Project.create({
      projectName,
      description,
      owner: req.user.id,
      members: [req.user.id]
    });
    res.status(201).json(newProject);
  } catch (error) {
    res.status(500).json({ message: 'Error creating project', error: error.message });
  }
};

exports.getProjects = async (req, res) => {
  try {
    const projects = await Project.find({ members: req.user.id });
    res.status(200).json(projects);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching projects' });
  }
};