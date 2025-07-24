const asyncHandler = require('express-async-handler');
const Sprint = require('../models/Sprint');
const Project = require('../models/Project');
const User = require('../models/User');

// @desc    Get all sprints
// @route   GET /api/admin/sprints
// @access  Private/Admin
const getSprints = asyncHandler(async (req, res) => {
  const sprints = await Sprint.find({})
    .populate('project', 'name team')
    .populate({
      path: 'project',
      populate: {
        path: 'team',
        select: 'name'
      }
    })
    .lean();

  res.json(sprints);
});

// @desc    Get sprint by ID
// @route   GET /api/admin/sprints/:id
// @access  Private/Admin
const getSprintById = asyncHandler(async (req, res) => {
  const sprint = await Sprint.findById(req.params.id)
    .populate('project', 'name team')
    .populate({
      path: 'project',
      populate: {
        path: 'team',
        select: 'name'
      }
    })
    .lean();

  if (!sprint) {
    res.status(404);
    throw new Error('Sprint not found');
  }

  res.json(sprint);
});

// @desc    Create a new sprint
// @route   POST /api/admin/sprints
// @access  Private/Admin
const createSprint = asyncHandler(async (req, res) => {
  const { name, description, project, status, startDate, endDate, goal, tasks } = req.body;

  if (!name || !project || !startDate || !endDate) {
    res.status(400);
    throw new Error('Sprint name, project, start date, and end date are required');
  }

  try {
    // Validate project ID
    const mongoose = require('mongoose');
    if (!mongoose.Types.ObjectId.isValid(project)) {
      res.status(400);
      throw new Error('Invalid project ID format');
    }

    const projectDoc = await Project.findById(project);
    if (!projectDoc) {
      res.status(400);
      throw new Error('Project not found');
    }

    // Validate dates
    const validatedStartDate = new Date(startDate);
    const validatedEndDate = new Date(endDate);
    
    if (isNaN(validatedStartDate.getTime()) || isNaN(validatedEndDate.getTime())) {
      res.status(400);
      throw new Error('Invalid date format');
    }

    if (validatedEndDate <= validatedStartDate) {
      res.status(400);
      throw new Error('End date must be after start date');
    }

    // Process tasks if provided
    let processedTasks = [];
    if (tasks && Array.isArray(tasks)) {
      processedTasks = tasks.map((task, index) => ({
        id: task.id || `TASK${String(index + 1).padStart(3, '0')}`,
        name: task.name,
        assignee: task.assignee,
        dueDate: task.dueDate ? new Date(task.dueDate) : validatedEndDate,
        status: task.status || 'todo',
        priority: task.priority || 'medium',
        estimatedHours: task.estimatedHours || 0,
        description: task.description || ''
      }));
    }

    const sprint = await Sprint.create({
      name,
      description,
      project,
      status: status || 'upcoming',
      startDate: validatedStartDate,
      endDate: validatedEndDate,
      goal,
      tasks: processedTasks,
      createdBy: req.user._id
    });

    const populatedSprint = await Sprint.findById(sprint._id)
      .populate('project', 'name team')
      .populate({
        path: 'project',
        populate: {
          path: 'team',
          select: 'name'
        }
      });

    res.status(201).json(populatedSprint);
  } catch (error) {
    console.error('Error creating sprint:', error);
    res.status(500).json({ message: error.message || 'Server error creating sprint' });
  }
});

// @desc    Update a sprint
// @route   PUT /api/admin/sprints/:id
// @access  Private/Admin
const updateSprint = asyncHandler(async (req, res) => {
  const sprint = await Sprint.findById(req.params.id);

  if (!sprint) {
    res.status(404);
    throw new Error('Sprint not found');
  }

  try {
    const { name, description, project, status, startDate, endDate, goal, tasks } = req.body;

    // Update sprint fields
    sprint.name = name || sprint.name;
    sprint.description = description || sprint.description;
    sprint.project = project || sprint.project;
    sprint.status = status || sprint.status;
    sprint.startDate = startDate ? new Date(startDate) : sprint.startDate;
    sprint.endDate = endDate ? new Date(endDate) : sprint.endDate;
    sprint.goal = goal || sprint.goal;

    // Update tasks if provided
    if (tasks && Array.isArray(tasks)) {
      sprint.tasks = tasks.map((task, index) => ({
        id: task.id || `TASK${String(index + 1).padStart(3, '0')}`,
        name: task.name,
        assignee: task.assignee,
        dueDate: task.dueDate ? new Date(task.dueDate) : sprint.endDate,
        status: task.status || 'todo',
        priority: task.priority || 'medium',
        estimatedHours: task.estimatedHours || 0,
        description: task.description || ''
      }));
    }

    // Calculate stats
    if (sprint.tasks && sprint.tasks.length > 0) {
      const completedTasks = sprint.tasks.filter(task => task.status === 'done').length;
      const totalTasks = sprint.tasks.length;
      const totalEstimatedTime = sprint.tasks.reduce((sum, task) => sum + (task.estimatedHours || 0), 0);

      sprint.stats = {
        tasksCompleted: completedTasks,
        totalTasks: totalTasks,
        timeSpent: 0, // This would need to be tracked separately
        estimatedTime: totalEstimatedTime
      };
    }

    await sprint.save();

    const updatedSprint = await Sprint.findById(sprint._id)
      .populate('project', 'name team')
      .populate({
        path: 'project',
        populate: {
          path: 'team',
          select: 'name'
        }
      });

    res.json(updatedSprint);
  } catch (error) {
    console.error('Error updating sprint:', error);
    res.status(500).json({ message: error.message || 'Server error updating sprint' });
  }
});

// @desc    Delete a sprint
// @route   DELETE /api/admin/sprints/:id
// @access  Private/Admin
const deleteSprint = asyncHandler(async (req, res) => {
  const sprint = await Sprint.findById(req.params.id);

  if (!sprint) {
    res.status(404);
    throw new Error('Sprint not found');
  }

  try {
    await sprint.deleteOne();
    res.json({ message: 'Sprint deleted successfully' });
  } catch (error) {
    console.error('Error deleting sprint:', error);
    res.status(500).json({ message: error.message || 'Server error deleting sprint' });
  }
});

// @desc    Get sprints by project ID
// @route   GET /api/admin/sprints/project/:projectId
// @access  Private/Admin
const getSprintsByProject = asyncHandler(async (req, res) => {
  const { projectId } = req.params;

  // Validate project ID
  const mongoose = require('mongoose');
  if (!mongoose.Types.ObjectId.isValid(projectId)) {
    res.status(400);
    throw new Error('Invalid project ID format');
  }

  const sprints = await Sprint.find({ project: projectId })
    .populate('project', 'name team')
    .lean();

  res.json(sprints);
});

module.exports = {
  getSprints,
  getSprintById,
  createSprint,
  updateSprint,
  deleteSprint,
  getSprintsByProject
};
