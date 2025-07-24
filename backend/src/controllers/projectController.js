const asyncHandler = require('express-async-handler');
const Project = require('../models/Project');
const Team = require('../models/Team');
const User = require('../models/User');

// @desc    Get all projects
// @route   GET /api/admin/projects
// @access  Private/Admin
const getProjects = asyncHandler(async (req, res) => {
  const projects = await Project.find({})
    .populate('team', 'name department')
    .populate('lead', 'name email profileImg')
    .populate('teamMembers', 'name email profileImg role')
    .lean();

  res.json(projects);
});

// @desc    Get project by ID
// @route   GET /api/admin/projects/:id
// @access  Private/Admin
const getProjectById = asyncHandler(async (req, res) => {
  const project = await Project.findById(req.params.id)
    .populate('team', 'name department')
    .populate('lead', 'name email profileImg')
    .populate('teamMembers', 'name email profileImg role')
    .lean();

  if (!project) {
    res.status(404);
    throw new Error('Project not found');
  }

  res.json(project);
});

// @desc    Create a new project
// @route   POST /api/admin/projects
// @access  Private/Admin
const createProject = asyncHandler(async (req, res) => {
  const { name, description, team, lead, startDate, deadline, priority, teamMembers } = req.body;

  if (!name || !deadline) {
    res.status(400);
    throw new Error('Project name and deadline are required');
  }

  try {
    const project = await Project.create({
      name,
      description,
      team,
      lead,
      startDate: startDate ? new Date(startDate) : new Date(),
      deadline: new Date(deadline),
      priority: priority || 'medium',
      teamMembers: teamMembers || [],
      status: 'not-started',
      progress: 0
    });

    // If team is assigned, update the team to include this project
    if (team) {
      await Team.findByIdAndUpdate(team, {
        $addToSet: { projects: project._id }
      });
    }

    const populatedProject = await Project.findById(project._id)
      .populate('team', 'name department')
      .populate('lead', 'name email profileImg')
      .populate('teamMembers', 'name email profileImg role');

    res.status(201).json(populatedProject);
  } catch (error) {
    console.error('Error creating project:', error);
    res.status(500).json({ message: error.message || 'Server error creating project' });
  }
});

// @desc    Update a project
// @route   PUT /api/admin/projects/:id
// @access  Private/Admin
const updateProject = asyncHandler(async (req, res) => {
  const project = await Project.findById(req.params.id);

  if (!project) {
    res.status(404);
    throw new Error('Project not found');
  }

  try {
    const { name, description, team, lead, startDate, deadline, priority, teamMembers, status, progress } = req.body;

    // Store old team for cleanup
    const oldTeam = project.team;

    // Update project fields
    project.name = name || project.name;
    project.description = description || project.description;
    project.team = team || project.team;
    project.lead = lead || project.lead;
    project.startDate = startDate ? new Date(startDate) : project.startDate;
    project.deadline = deadline ? new Date(deadline) : project.deadline;
    project.priority = priority || project.priority;
    project.teamMembers = teamMembers || project.teamMembers;
    project.status = status || project.status;
    project.progress = progress !== undefined ? progress : project.progress;

    await project.save();

    // Update team relationships
    if (oldTeam && oldTeam.toString() !== team) {
      // Remove project from old team
      await Team.findByIdAndUpdate(oldTeam, {
        $pull: { projects: project._id }
      });
    }

    if (team && (!oldTeam || oldTeam.toString() !== team)) {
      // Add project to new team
      await Team.findByIdAndUpdate(team, {
        $addToSet: { projects: project._id }
      });
    }

    const updatedProject = await Project.findById(project._id)
      .populate('team', 'name department')
      .populate('lead', 'name email profileImg')
      .populate('teamMembers', 'name email profileImg role');

    res.json(updatedProject);
  } catch (error) {
    console.error('Error updating project:', error);
    res.status(500).json({ message: error.message || 'Server error updating project' });
  }
});

// @desc    Delete a project
// @route   DELETE /api/admin/projects/:id
// @access  Private/Admin
const deleteProject = asyncHandler(async (req, res) => {
  const project = await Project.findById(req.params.id);

  if (!project) {
    res.status(404);
    throw new Error('Project not found');
  }

  try {
    // Remove project from team
    if (project.team) {
      await Team.findByIdAndUpdate(project.team, {
        $pull: { projects: project._id }
      });
    }

    // Delete the project
    await project.deleteOne();

    res.json({ message: 'Project deleted successfully' });
  } catch (error) {
    console.error('Error deleting project:', error);
    res.status(500).json({ message: error.message || 'Server error deleting project' });
  }
});

module.exports = {
  getProjects,
  getProjectById,
  createProject,
  updateProject,
  deleteProject
};
