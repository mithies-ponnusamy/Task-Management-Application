const asyncHandler = require('express-async-handler');
const Sprint = require('../models/Sprint');
const Project = require('../models/Project');
const User = require('../models/User');

// @desc    Get all sprints
// @route   GET /api/admin/sprints
// @access  Private/Admin
const getSprints = asyncHandler(async (req, res) => {
  const sprints = await Sprint.find({})
    .populate('project', 'name description')
    .populate('tasks.assignee', 'name email profileImg')
    .populate('createdBy', 'name email')
    .sort({ createdAt: -1 })
    .lean();

  res.json(sprints);
});

// @desc    Get sprint by ID
// @route   GET /api/admin/sprints/:id
// @access  Private/Admin
const getSprintById = asyncHandler(async (req, res) => {
  const sprint = await Sprint.findById(req.params.id)
    .populate('project', 'name description team lead')
    .populate('tasks.assignee', 'name email profileImg role')
    .populate('createdBy', 'name email')
    .lean();

  if (!sprint) {
    res.status(404);
    throw new Error('Sprint not found');
  }

  res.json(sprint);
});

// @desc    Create new sprint
// @route   POST /api/admin/sprints
// @access  Private/Admin
const createSprint = asyncHandler(async (req, res) => {
  const { name, description, project, status, startDate, endDate, goal, tasks } = req.body;

  console.log('Creating sprint with data:', { name, description, project, status, startDate, endDate, goal, tasks });

  if (!name || !project || !startDate || !endDate) {
    res.status(400);
    throw new Error('Sprint name, project, start date, and end date are required');
  }

  try {
    // Validate project ID
    let validatedProject = null;
    if (project && project !== 'undefined' && project !== 'null' && project.toString().trim() !== '') {
      const mongoose = require('mongoose');
      const projectStr = project.toString().trim();
      
      if (!mongoose.Types.ObjectId.isValid(projectStr)) {
        res.status(400);
        throw new Error(`Invalid project ID format: ${projectStr}`);
      }
      
      const projectDoc = await Project.findById(projectStr);
      if (!projectDoc) {
        res.status(400);
        throw new Error('Project not found');
      }
      validatedProject = projectStr;
    }

    // Validate dates
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    if (start >= end) {
      res.status(400);
      throw new Error('End date must be after start date');
    }

    // Validate and process tasks if provided
    let validatedTasks = [];
    if (tasks && Array.isArray(tasks) && tasks.length > 0) {
      for (const task of tasks) {
        if (!task.name || !task.assignee) {
          res.status(400);
          throw new Error('Task name and assignee are required for all tasks');
        }

        // Validate assignee ID
        const mongoose = require('mongoose');
        const assigneeStr = task.assignee.toString().trim();
        
        if (!mongoose.Types.ObjectId.isValid(assigneeStr)) {
          res.status(400);
          throw new Error(`Invalid assignee ID format: ${assigneeStr}`);
        }
        
        const assigneeUser = await User.findById(assigneeStr);
        if (!assigneeUser) {
          res.status(400);
          throw new Error(`Assignee not found: ${assigneeStr}`);
        }

        validatedTasks.push({
          id: task.id || `T${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          name: task.name.trim(),
          assignee: assigneeStr,
          dueDate: task.dueDate || end,
          status: task.status || 'todo',
          priority: task.priority || 'medium',
          estimatedHours: task.estimatedHours || 0,
          description: task.description || ''
        });
      }
    }

    // Create sprint
    const sprint = new Sprint({
      name: name.trim(),
      description: description?.trim() || '',
      project: validatedProject,
      status: status || 'upcoming',
      startDate: start,
      endDate: end,
      goal: goal?.trim() || '',
      tasks: validatedTasks,
      createdBy: req.user._id
    });

    const createdSprint = await sprint.save();
    
    // Populate the created sprint for response
    const populatedSprint = await Sprint.findById(createdSprint._id)
      .populate('project', 'name description')
      .populate('tasks.assignee', 'name email profileImg')
      .populate('createdBy', 'name email')
      .lean();

    console.log('Sprint created successfully:', populatedSprint._id);
    res.status(201).json(populatedSprint);

  } catch (error) {
    console.error('Error creating sprint:', error);
    res.status(500);
    throw new Error(error.message || 'Server error creating sprint');
  }
});

// @desc    Update sprint
// @route   PUT /api/admin/sprints/:id
// @access  Private/Admin
const updateSprint = asyncHandler(async (req, res) => {
  const { name, description, project, status, startDate, endDate, goal, tasks } = req.body;

  console.log('Updating sprint with data:', { name, description, project, status, startDate, endDate, goal, tasks });

  try {
    const sprint = await Sprint.findById(req.params.id);

    if (!sprint) {
      res.status(404);
      throw new Error('Sprint not found');
    }

    // Validate project ID if provided
    let validatedProject = sprint.project;
    if (project && project !== 'undefined' && project !== 'null' && project.toString().trim() !== '') {
      const mongoose = require('mongoose');
      const projectStr = project.toString().trim();
      
      if (!mongoose.Types.ObjectId.isValid(projectStr)) {
        res.status(400);
        throw new Error(`Invalid project ID format: ${projectStr}`);
      }
      
      const projectDoc = await Project.findById(projectStr);
      if (!projectDoc) {
        res.status(400);
        throw new Error('Project not found');
      }
      validatedProject = projectStr;
    }

    // Validate dates if provided
    let validatedStartDate = sprint.startDate;
    let validatedEndDate = sprint.endDate;
    
    if (startDate) validatedStartDate = new Date(startDate);
    if (endDate) validatedEndDate = new Date(endDate);
    
    if (validatedStartDate >= validatedEndDate) {
      res.status(400);
      throw new Error('End date must be after start date');
    }

    // Validate and process tasks if provided
    let validatedTasks = sprint.tasks;
    if (tasks && Array.isArray(tasks)) {
      validatedTasks = [];
      for (const task of tasks) {
        if (!task.name || !task.assignee) {
          res.status(400);
          throw new Error('Task name and assignee are required for all tasks');
        }

        // Validate assignee ID
        const mongoose = require('mongoose');
        const assigneeStr = task.assignee.toString().trim();
        
        if (!mongoose.Types.ObjectId.isValid(assigneeStr)) {
          res.status(400);
          throw new Error(`Invalid assignee ID format: ${assigneeStr}`);
        }
        
        const assigneeUser = await User.findById(assigneeStr);
        if (!assigneeUser) {
          res.status(400);
          throw new Error(`Assignee not found: ${assigneeStr}`);
        }

        validatedTasks.push({
          id: task.id || `T${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          name: task.name.trim(),
          assignee: assigneeStr,
          dueDate: task.dueDate || validatedEndDate,
          status: task.status || 'todo',
          priority: task.priority || 'medium',
          estimatedHours: task.estimatedHours || 0,
          description: task.description || ''
        });
      }
    }

    // Update sprint fields
    if (name) sprint.name = name.trim();
    if (description !== undefined) sprint.description = description.trim();
    if (validatedProject) sprint.project = validatedProject;
    if (status) sprint.status = status;
    if (startDate) sprint.startDate = validatedStartDate;
    if (endDate) sprint.endDate = validatedEndDate;
    if (goal !== undefined) sprint.goal = goal.trim();
    sprint.tasks = validatedTasks;

    const updatedSprint = await sprint.save();

    // Populate the updated sprint for response
    const populatedSprint = await Sprint.findById(updatedSprint._id)
      .populate('project', 'name description')
      .populate('tasks.assignee', 'name email profileImg')
      .populate('createdBy', 'name email')
      .lean();

    console.log('Sprint updated successfully:', populatedSprint._id);
    res.json(populatedSprint);

  } catch (error) {
    console.error('Error updating sprint:', error);
    res.status(500);
    throw new Error(error.message || 'Server error updating sprint');
  }
});

// @desc    Delete sprint
// @route   DELETE /api/admin/sprints/:id
// @access  Private/Admin
const deleteSprint = asyncHandler(async (req, res) => {
  try {
    const sprint = await Sprint.findById(req.params.id);

    if (!sprint) {
      res.status(404);
      throw new Error('Sprint not found');
    }

    await Sprint.findByIdAndDelete(req.params.id);
    res.json({ message: 'Sprint deleted successfully' });
  } catch (error) {
    console.error('Error deleting sprint:', error);
    res.status(500).json({ message: error.message || 'Server error deleting sprint' });
  }
});

// @desc    Get sprints by project
// @route   GET /api/admin/sprints/project/:projectId
// @access  Private/Admin
const getSprintsByProject = asyncHandler(async (req, res) => {
  try {
    const { projectId } = req.params;
    
    const mongoose = require('mongoose');
    if (!mongoose.Types.ObjectId.isValid(projectId)) {
      res.status(400);
      throw new Error('Invalid project ID format');
    }

    const sprints = await Sprint.find({ project: projectId })
      .populate('project', 'name description')
      .populate('tasks.assignee', 'name email profileImg')
      .populate('createdBy', 'name email')
      .sort({ startDate: -1 })
      .lean();

    res.json(sprints);
  } catch (error) {
    console.error('Error getting sprints by project:', error);
    res.status(500);
    throw new Error(error.message || 'Server error getting sprints');
  }
});

module.exports = {
  getSprints,
  getSprintById,
  createSprint,
  updateSprint,
  deleteSprint,
  getSprintsByProject
};
