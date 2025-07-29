const asyncHandler = require('express-async-handler');
const User = require('../models/User');
const Team = require('../models/Team');
const Project = require('../models/Project');
const Sprint = require('../models/Sprint');
const Task = require('../models/Task');

// @desc    Get lead profile information
// @route   GET /api/lead/profile
// @access  Private/Lead
const getLeadProfile = asyncHandler(async (req, res) => {
  try {
    console.log('=== getLeadProfile START ===');
    console.log('User ID:', req.user._id);
    
    const lead = await User.findById(req.user._id)
      .select('-password')
      .populate('team', 'name department description')
      .lean();

    console.log('Lead found:', lead ? lead.name : 'not found');

    if (!lead) {
      res.status(404);
      throw new Error('Lead profile not found');
    }

    // Get additional team statistics if user is a team lead
    if (lead.role === 'team-lead') {
      console.log('Getting team statistics for team:', lead.team?._id);
      const teamStats = await getTeamStatistics(lead.team?._id);
      lead.teamStats = teamStats;
      console.log('Team stats retrieved');
    }

    console.log('=== getLeadProfile SUCCESS ===');
    res.json(lead);
  } catch (error) {
    console.error('=== getLeadProfile ERROR ===');
    console.error('Error details:', error);
    console.error('Error stack:', error.stack);
    res.status(500).json({ 
      message: error.message || 'Failed to fetch lead profile',
      error: process.env.NODE_ENV === 'development' ? error.stack : 'Internal server error'
    });
  }
});

// @desc    Update lead profile information
// @route   PUT /api/lead/profile
// @access  Private/Lead
const updateLeadProfile = asyncHandler(async (req, res) => {
  const {
    name,
    email,
    phone,
    bio,
    profileImg,
    skills,
    experience,
    education
  } = req.body;

  const lead = await User.findById(req.user._id);

  if (!lead) {
    res.status(404);
    throw new Error('Lead not found');
  }

  // Update fields if provided
  if (name) lead.name = name;
  if (email) lead.email = email;
  if (phone) lead.phone = phone;
  if (bio) lead.bio = bio;
  if (profileImg) lead.profileImg = profileImg;
  if (skills) lead.skills = skills;
  if (experience) lead.experience = experience;
  if (education) lead.education = education;

  const updatedLead = await lead.save();

  // Remove password from response
  const leadResponse = await User.findById(updatedLead._id)
    .select('-password')
    .populate('team', 'name department description');

  res.json(leadResponse);
});

// @desc    Get projects assigned to the team lead
// @route   GET /api/lead/projects
// @access  Private/Lead
const getLeadProjects = asyncHandler(async (req, res) => {
  try {
    console.log('=== getLeadProjects START ===');
    
    const lead = await User.findById(req.user._id).populate('team');
    console.log('Lead found:', lead ? lead.name : 'not found', 'Team:', lead?.team?._id);

    if (!lead) {
      res.status(404);
      throw new Error('Lead not found');
    }

    console.log('Starting project query...');
    
    // Find projects where this user is the lead OR projects assigned to their team
    const projects = await Project.find({
      $or: [
        { lead: lead._id },
        { team: lead.team?._id }
      ]
    })
      .populate('team', 'name department')
      .populate('lead', 'name email profileImg')
      .populate('teamMembers', 'name email profileImg role')
      .sort({ createdAt: -1 })
      .lean(); // Use lean() to get plain objects

    console.log('Projects found:', projects.length);

    // Get sprints for each project
    console.log('Getting sprints for projects...');
    const projectsWithSprints = await Promise.all(
      projects.map(async (project, index) => {
        console.log(`Processing project ${index + 1}:`, project.name);
        const sprints = await Sprint.find({ project: project._id })
          .select('name status startDate endDate tasks stats')
          .sort({ startDate: -1 })
          .lean(); // Use lean() for sprints too
        
        console.log(`Found ${sprints.length} sprints for project:`, project.name);
        
        return {
          ...project, // Now project is already a plain object
          sprints: sprints
        };
      })
    );

    console.log('=== getLeadProjects SUCCESS ===');
    res.json(projectsWithSprints);
  } catch (error) {
    console.error('=== getLeadProjects ERROR ===');
    console.error('Error details:', error);
    console.error('Error stack:', error.stack);
    res.status(500).json({ 
      message: error.message || 'Failed to fetch projects',
      error: process.env.NODE_ENV === 'development' ? error.stack : 'Internal server error'
    });
  }
});

// @desc    Get team members under this lead
// @route   GET /api/lead/team
// @access  Private/Lead
const getLeadTeam = asyncHandler(async (req, res) => {
  const lead = await User.findById(req.user._id);

  if (!lead) {
    res.status(404);
    throw new Error('Lead not found');
  }

  if (!lead.team) {
    return res.json({
      team: null,
      members: [],
      projects: [],
      stats: {
        totalMembers: 0,
        activeProjects: 0,
        completedTasks: 0,
        totalTasks: 0
      }
    });
  }

  // Get team details
  const team = await Team.findById(lead.team)
    .populate('lead', 'name email profileImg')
    .populate('projects', 'name status progress priority deadline');

  // Get team members separately
  const teamMembers = await User.find({ team: team._id })
    .select('name email profileImg role status skills');

  if (!team) {
    res.status(404);
    throw new Error('Team not found');
  }

  // Get team statistics
  const stats = await getTeamStatistics(team._id);

  res.json({
    team: team,
    members: teamMembers,
    projects: team.projects,
    stats: stats
  });
});

// @desc    Get dashboard statistics for team lead
// @route   GET /api/lead/dashboard
// @access  Private/Lead
const getLeadDashboardStats = asyncHandler(async (req, res) => {
  const lead = await User.findById(req.user._id);

  if (!lead) {
    res.status(404);
    throw new Error('Lead not found');
  }

  const stats = {
    personalStats: {
      assignedProjects: 0,
      completedProjects: 0,
      activeTasks: 0,
      completedTasks: 0
    },
    teamStats: {
      totalMembers: 0,
      activeProjects: 0,
      teamProgress: 0,
      upcomingSprints: 0
    }
  };

  // Get personal project statistics
  const personalProjects = await Project.find({ lead: lead._id });
  stats.personalStats.assignedProjects = personalProjects.length;
  stats.personalStats.completedProjects = personalProjects.filter(p => p.status === 'completed').length;

  // Get team statistics if lead has a team
  if (lead.team) {
    const teamStats = await getTeamStatistics(lead.team);
    stats.teamStats = teamStats;
  }

  // Get recent activities (last 7 days)
  const oneWeekAgo = new Date();
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

  const recentActivities = await Project.find({
    $or: [
      { lead: lead._id },
      { team: lead.team }
    ],
    updatedAt: { $gte: oneWeekAgo }
  })
    .select('name status updatedAt')
    .sort({ updatedAt: -1 })
    .limit(10);

  stats.recentActivities = recentActivities;

  res.json(stats);
});

// Helper function to calculate team statistics
const getTeamStatistics = async (teamId) => {
  try {
    console.log('=== getTeamStatistics START ===');
    console.log('Team ID:', teamId);

    if (!teamId) {
      console.log('No team ID provided, returning default stats');
      return {
        totalMembers: 0,
        activeProjects: 0,
        teamProgress: 0,
        upcomingSprints: 0,
        completedTasks: 0,
        totalTasks: 0
      };
    }

    console.log('Getting team members count...');
    // Get team members count
    const totalMembers = await User.countDocuments({ team: teamId });
    console.log('Total members:', totalMembers);

    console.log('Getting projects for team...');
    // Get projects for this team
    const projects = await Project.find({ team: teamId });
    console.log('Projects found:', projects.length);
    const activeProjects = projects.filter(p => p.status === 'in-progress' || p.status === 'planning').length;
    console.log('Active projects:', activeProjects);

    // Calculate average team progress
    const totalProgress = projects.reduce((sum, project) => sum + (project.progress || 0), 0);
    const teamProgress = projects.length > 0 ? Math.round(totalProgress / projects.length) : 0;

    console.log('Getting upcoming sprints...');
    // Get upcoming sprints
    const upcomingSprints = await Sprint.countDocuments({
      project: { $in: projects.map(p => p._id) },
      status: 'upcoming',
      startDate: { $gte: new Date() }
    });

    console.log('Getting task statistics...');
    // Get task statistics from sprints
    const sprints = await Sprint.find({
      project: { $in: projects.map(p => p._id) }
    });

    let totalTasks = 0;
    let completedTasks = 0;

    sprints.forEach(sprint => {
      if (sprint.tasks && sprint.tasks.length > 0) {
        totalTasks += sprint.tasks.length;
        completedTasks += sprint.tasks.filter(task => task.status === 'done').length;
      }
    });

    console.log('=== getTeamStatistics SUCCESS ===');
    const stats = {
      totalMembers,
      activeProjects,
      teamProgress,
      upcomingSprints,
      completedTasks,
      totalTasks
    };
    console.log('Stats:', stats);
    
    return stats;
  } catch (error) {
    console.error('=== getTeamStatistics ERROR ===');
    console.error('Error details:', error);
    return {
      totalMembers: 0,
      activeProjects: 0,
      teamProgress: 0,
      upcomingSprints: 0,
      completedTasks: 0,
      totalTasks: 0
    };
  }
};

// ================== TEAM MANAGEMENT ==================

// @desc    Get available users that can be added to team (non-lead roles only)
// @route   GET /api/lead/team/available-users
// @access  Private/Lead
const getAvailableUsers = asyncHandler(async (req, res) => {
  const lead = await User.findById(req.user._id).populate('team');

  if (!lead || !lead.team) {
    res.status(404);
    throw new Error('Lead or team not found');
  }

  // Get users who are not already in any team and have only 'user' role
  const availableUsers = await User.find({
    $and: [
      { team: null }, // Not in any team
      { role: 'user' }, // Only 'user' role (not 'member', 'admin', 'team-lead')
      { status: 'active' }, // Only active users
      { _id: { $ne: req.user._id } } // Exclude the lead themselves
    ]
  })
    .select('name email profileImg role department status')
    .sort({ name: 1 });

  res.json(availableUsers);
});

// @desc    Add members to team lead's team
// @route   POST /api/lead/team/members
// @access  Private/Lead
const addTeamMembers = asyncHandler(async (req, res) => {
  console.log('=== addTeamMembers START ===');
  console.log('Request body:', JSON.stringify(req.body, null, 2));
  console.log('User from token:', req.user._id);
  
  const { userIds } = req.body;
  
  console.log('Received userIds:', userIds);
  console.log('userIds type:', typeof userIds);
  console.log('userIds is array:', Array.isArray(userIds));
  
  // Validate userIds
  if (!userIds || !Array.isArray(userIds) || userIds.length === 0) {
    console.log('Invalid userIds structure');
    res.status(400);
    throw new Error('Please provide valid user IDs');
  }

  // Log each userIds element
  userIds.forEach((id, index) => {
    console.log(`userIds[${index}]:`, id, 'type:', typeof id, 'value:', JSON.stringify(id));
  });

  // Filter out undefined, null, empty strings, and invalid ObjectIds
  const validUserIds = userIds.filter(id => {
    console.log('Filtering ID:', id, 'type:', typeof id);
    if (!id || id === 'undefined' || id === 'null' || id === '') {
      console.log('Filtered out invalid ID:', id);
      return false;
    }
    // Check if it's a valid ObjectId format (24 character hex string)
    const isValidObjectId = /^[0-9a-fA-F]{24}$/.test(id);
    console.log('ObjectId validation for', id, ':', isValidObjectId);
    return isValidObjectId;
  });

  console.log('Valid userIds after filtering:', validUserIds);

  if (validUserIds.length === 0) {
    console.log('No valid user IDs after filtering');
    res.status(400);
    throw new Error('No valid user IDs provided');
  }

  const lead = await User.findById(req.user._id);

  if (!lead || !lead.team) {
    res.status(404);
    throw new Error('Lead or team not found');
  }

  // Verify lead is actually the team lead
  const team = await Team.findById(lead.team);
  if (!team || team.lead.toString() !== lead._id.toString()) {
    res.status(403);
    throw new Error('Not authorized to manage this team');
  }

  // Additional validation right before query - ensure no undefined values
  const finalValidUserIds = validUserIds.filter(id => {
    const isValid = id && 
                   typeof id === 'string' && 
                   id !== 'undefined' && 
                   id !== 'null' && 
                   id.trim() !== '' &&
                   /^[0-9a-fA-F]{24}$/.test(id);
    console.log('Final validation for ID:', id, 'isValid:', isValid);
    return isValid;
  });

  console.log('Final validated user IDs:', finalValidUserIds);

  if (finalValidUserIds.length === 0) {
    console.log('No valid user IDs after final validation');
    res.status(400);
    throw new Error('No valid user IDs after final validation');
  }

  // Convert to proper ObjectIds
  const mongoose = require('mongoose');
  const objectIds = finalValidUserIds.map(id => {
    try {
      return new mongoose.Types.ObjectId(id);
    } catch (error) {
      console.error('Failed to create ObjectId for:', id, error);
      return null;
    }
  }).filter(id => id !== null);

  console.log('Converted ObjectIds:', objectIds);

  // Validate that users exist and are not already in teams
  const users = await User.find({ _id: { $in: objectIds } });
  const availableUsers = users.filter(user => !user.team);

  if (availableUsers.length === 0) {
    res.status(400);
    throw new Error('No available users to add to team');
  }

  // Add users to team
  await User.updateMany(
    { _id: { $in: availableUsers.map(u => u._id) } },
    { team: team._id }
  );

  // Update team members array
  const newMemberIds = availableUsers.map(u => u._id);
  team.members = [...new Set([...team.members, ...newMemberIds])];
  await team.save();

  // Get updated team members
  const teamMembers = await User.find({ team: team._id })
    .select('name email profileImg role status skills');

  res.json({
    message: `Added ${availableUsers.length} members to team`,
    members: teamMembers,
    team: team
  });
});

// @desc    Remove members from team lead's team
// @route   DELETE /api/lead/team/members
// @access  Private/Lead
const removeTeamMembers = asyncHandler(async (req, res) => {
  const { userIds } = req.body;
  const lead = await User.findById(req.user._id);

  if (!lead || !lead.team) {
    res.status(404);
    throw new Error('Lead or team not found');
  }

  // Verify lead is actually the team lead
  const team = await Team.findById(lead.team);
  if (!team || team.lead.toString() !== lead._id.toString()) {
    res.status(403);
    throw new Error('Not authorized to manage this team');
  }

  // Remove users from team
  await User.updateMany(
    { _id: { $in: userIds } },
    { $unset: { team: 1 } }
  );

  // Update team members array
  team.members = team.members.filter(memberId => 
    !userIds.includes(memberId.toString())
  );
  await team.save();

  // Get updated team members
  const teamMembers = await User.find({ team: team._id })
    .select('name email profileImg role status skills');

  res.json({
    message: `Removed ${userIds.length} members from team`,
    members: teamMembers,
    team: team
  });
});

// ================== TASK MANAGEMENT ==================

// @desc    Create task for a project
// @route   POST /api/lead/tasks
// @access  Private/Lead
const createTask = asyncHandler(async (req, res) => {
  console.log('=== CREATE TASK DEBUG ===');
  console.log('Request body:', req.body);
  console.log('User:', req.user._id);
  
  const {
    title,
    description,
    assignee,
    projectId,
    sprintId,
    priority,
    dueDate,
    storyPoints
  } = req.body;

  console.log('Extracted fields:', {
    title,
    description,
    assignee,
    projectId,
    sprintId,
    priority,
    dueDate,
    storyPoints
  });

  const lead = await User.findById(req.user._id);
  if (!lead) {
    res.status(404);
    throw new Error('Lead not found');
  }

  // Verify the project belongs to the lead's team or lead is assigned to it
  const project = await Project.findById(projectId);
  if (!project) {
    res.status(404);
    throw new Error('Project not found');
  }

  // Check if lead has permission to create tasks for this project
  const hasPermission = project.lead.toString() === lead._id.toString() || 
                       (lead.team && project.team && project.team.toString() === lead.team.toString());

  if (!hasPermission) {
    res.status(403);
    throw new Error('Not authorized to create tasks for this project');
  }

  // Verify assignee is in the same team
  if (assignee) {
    const assigneeUser = await User.findById(assignee);
    if (!assigneeUser || assigneeUser.team?.toString() !== lead.team?.toString()) {
      res.status(400);
      throw new Error('Assignee must be in the same team');
    }
  }

  // Verify sprint belongs to the project
  if (sprintId) {
    const sprint = await Sprint.findById(sprintId);
    if (!sprint || sprint.project.toString() !== projectId) {
      res.status(400);
      throw new Error('Sprint does not belong to this project');
    }
  }

  console.log('About to create task with data:', {
    title,
    description,
    assignee: assignee || null,
    project: projectId,
    sprint: sprintId || null,
    priority: priority || 'medium',
    status: 'todo',
    dueDate,
    storyPoints: storyPoints || 1,
    createdBy: lead._id
  });

  const task = await Task.create({
    title,
    description,
    assignee: assignee || null,
    project: projectId,
    sprint: sprintId || null,
    priority: priority || 'medium',
    status: 'to-do',
    dueDate,
    storyPoints: storyPoints || 1,
    createdBy: lead._id
  });

  // Populate task details
  const populatedTask = await Task.findById(task._id)
    .populate('assignee', 'name email profileImg')
    .populate('project', 'name')
    .populate('sprint', 'name')
    .populate('createdBy', 'name');

  res.status(201).json(populatedTask);
});

// @desc    Get all tasks for lead's projects
// @route   GET /api/lead/tasks
// @access  Private/Lead
const getLeadTasks = asyncHandler(async (req, res) => {
  const { projectId, sprintId, status, assignee } = req.query;
  const lead = await User.findById(req.user._id);

  if (!lead) {
    res.status(404);
    throw new Error('Lead not found');
  }

  // Get projects where this lead has access
  const projectFilter = {
    $or: [
      { lead: lead._id },
      { team: lead.team }
    ]
  };

  if (projectId) {
    projectFilter._id = projectId;
  }

  const projects = await Project.find(projectFilter).select('_id');
  const projectIds = projects.map(p => p._id);

  // Build task filter
  const taskFilter = { project: { $in: projectIds } };
  
  if (sprintId) taskFilter.sprint = sprintId;
  if (status) taskFilter.status = status;
  if (assignee) taskFilter.assignee = assignee;

  const tasks = await Task.find(taskFilter)
    .populate('assignee', 'name email profileImg')
    .populate('project', 'name')
    .populate('sprint', 'name status')
    .populate('createdBy', 'name')
    .sort({ createdAt: -1 });

  res.json(tasks);
});

// @desc    Update task
// @route   PUT /api/lead/tasks/:id
// @access  Private/Lead
const updateTask = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const lead = await User.findById(req.user._id);

  if (!lead) {
    res.status(404);
    throw new Error('Lead not found');
  }

  const task = await Task.findById(id).populate('project');
  if (!task) {
    res.status(404);
    throw new Error('Task not found');
  }

  // Check if lead has permission to update this task
  const hasPermission = task.project.lead?.toString() === lead._id.toString() || 
                       (lead.team && task.project.team?.toString() === lead.team.toString());

  if (!hasPermission) {
    res.status(403);
    throw new Error('Not authorized to update this task');
  }

  // Update task fields
  const updateFields = {};
  const allowedFields = ['title', 'description', 'assignee', 'priority', 'status', 'dueDate', 'storyPoints'];
  
  allowedFields.forEach(field => {
    if (req.body[field] !== undefined) {
      updateFields[field] = req.body[field];
    }
  });

  const updatedTask = await Task.findByIdAndUpdate(id, updateFields, { new: true })
    .populate('assignee', 'name email profileImg')
    .populate('project', 'name')
    .populate('sprint', 'name')
    .populate('createdBy', 'name');

  res.json(updatedTask);
});

// @desc    Delete task
// @route   DELETE /api/lead/tasks/:id
// @access  Private/Lead
const deleteTask = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const lead = await User.findById(req.user._id);

  if (!lead) {
    res.status(404);
    throw new Error('Lead not found');
  }

  const task = await Task.findById(id).populate('project');
  if (!task) {
    res.status(404);
    throw new Error('Task not found');
  }

  // Check if lead has permission to delete this task
  const hasPermission = task.project.lead?.toString() === lead._id.toString() || 
                       (lead.team && task.project.team?.toString() === lead.team.toString());

  if (!hasPermission) {
    res.status(403);
    throw new Error('Not authorized to delete this task');
  }

  // Remove task from sprint if it's in one
  if (task.sprint) {
    await Sprint.findByIdAndUpdate(task.sprint, {
      $pull: { tasks: task._id }
    });
  }

  await Task.findByIdAndDelete(id);

  res.json({ message: 'Task deleted successfully' });
});

// ================== SPRINT MANAGEMENT ==================

// @desc    Get sprints for lead's projects
// @route   GET /api/lead/sprints
// @access  Private/Lead
const getLeadSprints = asyncHandler(async (req, res) => {
  try {
    console.log('=== getLeadSprints START ===');
    const { projectId, status } = req.query;
    
    const lead = await User.findById(req.user._id).populate('team');
    console.log('Lead found:', lead ? lead.name : 'not found', 'Team:', lead?.team?._id);

    if (!lead) {
      res.status(404);
      throw new Error('Lead not found');
    }

    // Build project filter - same logic as getLeadProjects
    const projectFilter = {
      $or: [
        { lead: lead._id },
        { team: lead.team?._id }
      ]
    };

    if (projectId) {
      projectFilter._id = projectId;
    }

    console.log('Project filter:', JSON.stringify(projectFilter));

    const projects = await Project.find(projectFilter).select('_id name');
    const projectIds = projects.map(p => p._id);
    
    console.log('Found projects:', projects.length, 'IDs:', projectIds);

    // Build sprint filter
    const sprintFilter = { project: { $in: projectIds } };
    if (status) sprintFilter.status = status;

    console.log('Sprint filter:', JSON.stringify(sprintFilter));

    const sprints = await Sprint.find(sprintFilter)
      .populate('project', 'name')
      .populate('tasks')
      .sort({ startDate: -1 })
      .lean();

    console.log('Found sprints:', sprints.length);
    console.log('Sprint details:', sprints.map(s => ({ name: s.name, project: s.project?.name })));

    console.log('=== getLeadSprints SUCCESS ===');
    res.json(sprints);
  } catch (error) {
    console.error('=== getLeadSprints ERROR ===');
    console.error('Error details:', error);
    console.error('Error stack:', error.stack);
    res.status(500).json({ 
      message: error.message || 'Failed to fetch sprints',
      error: process.env.NODE_ENV === 'development' ? error.stack : 'Internal server error'
    });
  }
});

// @desc    Update sprint (limited fields for team lead)
// @route   PUT /api/lead/sprints/:id
// @access  Private/Lead
const updateSprint = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const lead = await User.findById(req.user._id);

  if (!lead) {
    res.status(404);
    throw new Error('Lead not found');
  }

  const sprint = await Sprint.findById(id).populate('project');
  if (!sprint) {
    res.status(404);
    throw new Error('Sprint not found');
  }

  // Check if lead has permission to update this sprint
  const hasPermission = sprint.project.lead?.toString() === lead._id.toString() || 
                       (lead.team && sprint.project.team?.toString() === lead.team.toString());

  if (!hasPermission) {
    res.status(403);
    throw new Error('Not authorized to update this sprint');
  }

  // Team leads can only update certain fields
  const updateFields = {};
  const allowedFields = ['status', 'stats']; // Limited fields for team leads
  
  allowedFields.forEach(field => {
    if (req.body[field] !== undefined) {
      updateFields[field] = req.body[field];
    }
  });

  const updatedSprint = await Sprint.findByIdAndUpdate(id, updateFields, { new: true })
    .populate('project', 'name')
    .populate('tasks');

  res.json(updatedSprint);
});

module.exports = {
  getLeadProfile,
  updateLeadProfile,
  getLeadProjects,
  getLeadTeam,
  getLeadDashboardStats,
  // Team management
  getAvailableUsers,
  addTeamMembers,
  removeTeamMembers,
  // Task management
  createTask,
  getLeadTasks,
  updateTask,
  deleteTask,
  // Sprint management
  getLeadSprints,
  updateSprint
};
