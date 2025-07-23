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
    .populate('tasks', 'title status priority')
    .lean();

  // Calculate progress if not set
  const projectsWithProgress = projects.map(project => {
    if (project.tasks && project.tasks.length > 0) {
      const completedTasks = project.tasks.filter(task => task.status === 'done').length;
      const calculatedProgress = Math.round((completedTasks / project.tasks.length) * 100);
      project.progress = project.progress || calculatedProgress;
    }
    return project;
  });

  res.json(projectsWithProgress);
});

// @desc    Get a single project by ID
// @route   GET /api/admin/projects/:id
// @access  Private/Admin
const getProjectById = asyncHandler(async (req, res) => {
  const project = await Project.findById(req.params.id)
    .populate('team', 'name department members')
    .populate('lead', 'name email profileImg phone role')
    .populate('teamMembers', 'name email profileImg role department')
    .populate('tasks', 'title description assignee status priority startTime endTime');

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
  const { name, description, team, lead, deadline, priority, startDate, teamMembers } = req.body;

  console.log('Creating project with data:', { name, description, team, lead, deadline, priority, startDate, teamMembers });

  if (!name || !deadline) {
    res.status(400);
    throw new Error('Project name and deadline are required');
  }

  try {
    // Validate team ID if provided
    let validatedTeam = null;
    if (team && team !== 'undefined' && team !== 'null' && team.toString().trim() !== '') {
      const mongoose = require('mongoose');
      const teamStr = team.toString().trim();
      
      if (!mongoose.Types.ObjectId.isValid(teamStr)) {
        res.status(400);
        throw new Error(`Invalid team ID format: ${teamStr}`);
      }
      
      const teamDoc = await Team.findById(teamStr);
      if (!teamDoc) {
        res.status(400);
        throw new Error('Team not found');
      }
      validatedTeam = teamStr;
    }

    // Validate lead ID if provided
    let validatedLead = null;
    if (lead && lead !== 'undefined' && lead !== 'null' && lead.toString().trim() !== '') {
      const mongoose = require('mongoose');
      const leadStr = lead.toString().trim();
      
      if (!mongoose.Types.ObjectId.isValid(leadStr)) {
        res.status(400);
        throw new Error(`Invalid lead ID format: ${leadStr}`);
      }
      
      const leadUser = await User.findById(leadStr);
      if (!leadUser) {
        res.status(400);
        throw new Error('Lead user not found');
      }
      validatedLead = leadStr;
    }

    // Validate team members if provided
    let validatedTeamMembers = [];
    if (teamMembers && Array.isArray(teamMembers) && teamMembers.length > 0) {
      const mongoose = require('mongoose');
      for (const memberId of teamMembers) {
        if (memberId && memberId.toString().trim() !== '') {
          const memberStr = memberId.toString().trim();
          if (!mongoose.Types.ObjectId.isValid(memberStr)) {
            res.status(400);
            throw new Error(`Invalid team member ID format: ${memberStr}`);
          }
          
          const memberUser = await User.findById(memberStr);
          if (!memberUser) {
            res.status(400);
            throw new Error(`Team member not found: ${memberStr}`);
          }
          validatedTeamMembers.push(memberStr);
        }
      }
    }

    const project = await Project.create({
      name,
      description: description || '',
      team: validatedTeam,
      lead: validatedLead,
      startDate: startDate || new Date(),
      deadline: new Date(deadline),
      priority: priority || 'medium',
      status: 'not-started',
      progress: 0,
      teamMembers: validatedTeamMembers,
      tasks: []
    });

    // Update team's projects array if team is assigned
    if (validatedTeam) {
      await Team.findByIdAndUpdate(validatedTeam, {
        $addToSet: { projects: project._id }
      });
    }

    const populatedProject = await Project.findById(project._id)
      .populate('team', 'name department')
      .populate('lead', 'name email profileImg')
      .populate('teamMembers', 'name email profileImg');

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
  const { name, description, team, lead, deadline, priority, startDate, status, progress, teamMembers } = req.body;

  console.log('Updating project with data:', { id: req.params.id, name, description, team, lead, deadline, priority, startDate, status, progress, teamMembers });

  const project = await Project.findById(req.params.id);
  if (!project) {
    res.status(404);
    throw new Error('Project not found');
  }

  try {
    // Validate team ID if provided
    let validatedTeam = project.team;
    if (team !== undefined) {
      if (team && team !== 'undefined' && team !== 'null' && team.toString().trim() !== '') {
        const mongoose = require('mongoose');
        const teamStr = team.toString().trim();
        
        if (!mongoose.Types.ObjectId.isValid(teamStr)) {
          res.status(400);
          throw new Error(`Invalid team ID format: ${teamStr}`);
        }
        
        const teamDoc = await Team.findById(teamStr);
        if (!teamDoc) {
          res.status(400);
          throw new Error('Team not found');
        }
        validatedTeam = teamStr;
      } else {
        validatedTeam = null;
      }
    }

    // Validate lead ID if provided
    let validatedLead = project.lead;
    if (lead !== undefined) {
      if (lead && lead !== 'undefined' && lead !== 'null' && lead.toString().trim() !== '') {
        const mongoose = require('mongoose');
        const leadStr = lead.toString().trim();
        
        if (!mongoose.Types.ObjectId.isValid(leadStr)) {
          res.status(400);
          throw new Error(`Invalid lead ID format: ${leadStr}`);
        }
        
        const leadUser = await User.findById(leadStr);
        if (!leadUser) {
          res.status(400);
          throw new Error('Lead user not found');
        }
        validatedLead = leadStr;
      } else {
        validatedLead = null;
      }
    }

    // Validate team members if provided
    let validatedTeamMembers = project.teamMembers;
    if (teamMembers !== undefined) {
      validatedTeamMembers = [];
      if (teamMembers && Array.isArray(teamMembers) && teamMembers.length > 0) {
        const mongoose = require('mongoose');
        for (const memberId of teamMembers) {
          if (memberId && memberId.toString().trim() !== '') {
            const memberStr = memberId.toString().trim();
            if (!mongoose.Types.ObjectId.isValid(memberStr)) {
              res.status(400);
              throw new Error(`Invalid team member ID format: ${memberStr}`);
            }
            
            const memberUser = await User.findById(memberStr);
            if (!memberUser) {
              res.status(400);
              throw new Error(`Team member not found: ${memberStr}`);
            }
            validatedTeamMembers.push(memberStr);
          }
        }
      }
    }

    // Handle team change - update teams' projects arrays
    if (validatedTeam && (!project.team || validatedTeam.toString() !== project.team.toString())) {
      // Remove from old team's projects
      if (project.team) {
        await Team.findByIdAndUpdate(project.team, {
          $pull: { projects: project._id }
        });
      }

      // Add to new team's projects
      await Team.findByIdAndUpdate(validatedTeam, {
        $addToSet: { projects: project._id }
      });
    } else if (!validatedTeam && project.team) {
      // Remove from old team if team is being removed
      await Team.findByIdAndUpdate(project.team, {
        $pull: { projects: project._id }
      });
    }

    const updatedProject = await Project.findByIdAndUpdate(
      req.params.id,
      {
        name: name || project.name,
        description: description !== undefined ? description : project.description,
        team: validatedTeam,
        lead: validatedLead,
        startDate: startDate ? new Date(startDate) : project.startDate,
        deadline: deadline ? new Date(deadline) : project.deadline,
        priority: priority || project.priority,
        status: status || project.status,
        progress: progress !== undefined ? progress : project.progress,
        teamMembers: validatedTeamMembers
      },
      { new: true }
    ).populate('team', 'name department')
     .populate('lead', 'name email profileImg')
     .populate('teamMembers', 'name email profileImg');

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
    // Remove project from team's projects array
    if (project.team) {
      await Team.findByIdAndUpdate(project.team, {
        $pull: { projects: project._id }
      });
    }

    await Project.findByIdAndDelete(req.params.id);
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
