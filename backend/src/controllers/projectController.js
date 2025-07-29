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

// @desc    Upload files to project
// @route   POST /api/admin/projects/:id/files
// @access  Private/Admin
const uploadProjectFiles = asyncHandler(async (req, res) => {
  const projectId = req.params.id;
  const uploadedFiles = req.files || [];

  if (!uploadedFiles || uploadedFiles.length === 0) {
    res.status(400);
    throw new Error('No files uploaded');
  }

  try {
    const project = await Project.findById(projectId);
    
    if (!project) {
      res.status(404);
      throw new Error('Project not found');
    }

    // Create file objects for each uploaded file
    const newFiles = uploadedFiles.map(file => ({
      id: `file_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      name: file.originalname,
      filename: file.filename,
      originalName: file.originalname,
      size: file.size,
      type: file.mimetype,
      path: file.path,
      url: `/uploads/${file.filename}`,
      uploadedAt: new Date(),
      uploadedBy: req.user._id
    }));

    // Add files to project
    if (!project.files) {
      project.files = [];
    }
    project.files.push(...newFiles);

    await project.save();

    res.status(201).json({
      message: `${newFiles.length} file(s) uploaded successfully`,
      files: newFiles,
      project: project
    });
  } catch (error) {
    console.error('Error uploading files:', error);
    res.status(500).json({ message: error.message || 'Server error uploading files' });
  }
});

// @desc    Delete file from project
// @route   DELETE /api/admin/projects/:id/files/:fileId
// @access  Private/Admin
const deleteProjectFile = asyncHandler(async (req, res) => {
  const { id: projectId, fileId } = req.params;

  try {
    const project = await Project.findById(projectId);
    
    if (!project) {
      res.status(404);
      throw new Error('Project not found');
    }

    // Remove file from project files array
    project.files = project.files.filter(file => file.id !== fileId);
    await project.save();

    res.json({ 
      message: 'File deleted successfully',
      project: project 
    });
  } catch (error) {
    console.error('Error deleting file:', error);
    res.status(500).json({ message: error.message || 'Server error deleting file' });
  }
});

// @desc    Add link to project
// @route   POST /api/admin/projects/:id/links
// @access  Private/Admin
const addProjectLink = asyncHandler(async (req, res) => {
  const projectId = req.params.id;
  const { url, title, description } = req.body;

  if (!url) {
    res.status(400);
    throw new Error('URL is required');
  }

  try {
    const project = await Project.findById(projectId);
    
    if (!project) {
      res.status(404);
      throw new Error('Project not found');
    }

    const newLink = {
      id: `link_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      title: title || url,
      url: url,
      description: description || '',
      addedAt: new Date(),
      addedBy: req.user._id
    };

    // Add link to project
    if (!project.links) {
      project.links = [];
    }
    project.links.push(newLink);

    await project.save();

    res.status(201).json({
      message: 'Link added successfully',
      link: newLink,
      project: project
    });
  } catch (error) {
    console.error('Error adding link:', error);
    res.status(500).json({ message: error.message || 'Server error adding link' });
  }
});

// @desc    Delete link from project
// @route   DELETE /api/admin/projects/:id/links/:linkId
// @access  Private/Admin
const deleteProjectLink = asyncHandler(async (req, res) => {
  const { id: projectId, linkId } = req.params;

  try {
    const project = await Project.findById(projectId);
    
    if (!project) {
      res.status(404);
      throw new Error('Project not found');
    }

    // Remove link from project links array
    project.links = project.links.filter(link => link.id !== linkId);
    await project.save();

    res.json({ 
      message: 'Link deleted successfully',
      project: project 
    });
  } catch (error) {
    console.error('Error deleting link:', error);
    res.status(500).json({ message: error.message || 'Server error deleting link' });
  }
});

module.exports = {
  getProjects,
  getProjectById,
  createProject,
  updateProject,
  deleteProject,
  uploadProjectFiles,
  deleteProjectFile,
  addProjectLink,
  deleteProjectLink
};
