const asyncHandler = require('express-async-handler');
const Team = require('../models/Team');
const User = require('../models/User');
const Project = require('../models/Project');

// @desc    Get all teams with hierarchy
// @route   GET /api/admin/teams
// @access  Private/Admin
const getTeams = asyncHandler(async (req, res) => {
  const teams = await Team.find({})
    .populate('lead', 'name email profileImg')
    .populate('members', 'name email profileImg role status department')
    .populate('projects', 'name status progress')
    .populate('parentTeam', 'name')
    .lean();

  // Calculate completion rate if not set
  const teamsWithCompletion = teams.map(team => {
    if (team.completionRate === 0 && team.projects && team.projects.length > 0) {
      const totalProgress = team.projects.reduce((sum, project) => sum + (project.progress || 0), 0);
      team.completionRate = Math.round(totalProgress / team.projects.length);
    }
    return team;
  });

  res.json(teamsWithCompletion);
});

// @desc    Get a single team by ID with full details
// @route   GET /api/admin/teams/:id
// @access  Private/Admin
const getTeamById = asyncHandler(async (req, res) => {
  const team = await Team.findById(req.params.id)
    .populate('lead', 'name email profileImg phone')
    .populate('members', 'name email role status profileImg department')
    .populate('projects', 'name startDate deadline status progress priority')
    .populate('parentTeam', 'name')
    .populate('subTeams', 'name membersCount projectsCount completionRate');

  if (!team) {
    res.status(404);
    throw new Error('Team not found');
  }

  // Calculate completion rate if not set
  if (team.completionRate === 0 && team.projects && team.projects.length > 0) {
    const totalProgress = team.projects.reduce((sum, project) => sum + (project.progress || 0), 0);
    team.completionRate = Math.round(totalProgress / team.projects.length);
    await team.save();
  }

  res.json(team);
});

// @desc    Create a new team
// @route   POST /api/admin/teams
// @access  Private/Admin
// teamController.js - Update createTeam method
const createTeam = asyncHandler(async (req, res) => {
  const { name, department, lead, description, parentTeam } = req.body;

  if (!name || !department) {
    res.status(400);
    throw new Error('Name and department are required');
  }

  // Check for team name uniqueness within the same parent context
  const existingTeamQuery = { name };
  if (parentTeam) {
    // For sub-teams, check uniqueness within the same parent
    existingTeamQuery.parentTeam = parentTeam;
  } else {
    // For main teams, check that no main team (without parent) has this name
    existingTeamQuery.parentTeam = { $in: [null, undefined] };
  }

  const teamExists = await Team.findOne(existingTeamQuery);
  if (teamExists) {
    const errorMessage = parentTeam ? 
      'A sub-team with this name already exists under the selected parent team' : 
      'A main team with this name already exists';
    res.status(400).json({ message: errorMessage });
    return;
  }

  try {
    const team = await Team.create({
      name,
      department,
      lead: lead || null,
      description: description || '',
      parentTeam: parentTeam || null,
      members: [],
      projects: [],
      completionRate: 0
    });

    if (parentTeam) {
      await Team.findByIdAndUpdate(parentTeam, {
        $addToSet: { subTeams: team._id }
      });
    }

    const populatedTeam = await Team.findById(team._id)
      .populate('lead', 'name email')
      .populate('parentTeam', 'name');

    res.status(201).json(populatedTeam);
  } catch (error) {
    console.error('Error creating team:', error);
    res.status(500).json({ message: 'Server error creating team' });
  }
});

// @desc    Update a team
// @route   PUT /api/admin/teams/:id
// @access  Private/Admin
const updateTeam = asyncHandler(async (req, res) => {
  const { name, department, lead, description, parentTeam } = req.body;

  const team = await Team.findById(req.params.id);
  if (!team) {
    res.status(404);
    throw new Error('Team not found');
  }

  // Handle parent team change
  if (parentTeam && (!team.parentTeam || parentTeam.toString() !== team.parentTeam.toString())) {
    // Remove from old parent's subTeams
    if (team.parentTeam) {
      await Team.findByIdAndUpdate(team.parentTeam, {
        $pull: { subTeams: team._id }
      });
    }

    // Add to new parent's subTeams
    await Team.findByIdAndUpdate(parentTeam, {
      $addToSet: { subTeams: team._id }
    });
  } else if (!parentTeam && team.parentTeam) {
    // Remove from parent's subTeams if parentTeam is being removed
    await Team.findByIdAndUpdate(team.parentTeam, {
      $pull: { subTeams: team._id }
    });
  }

  // Update team fields
  team.name = name || team.name;
  team.department = department || team.department;
  team.lead = lead || team.lead;
  team.description = description || team.description;
  team.parentTeam = parentTeam || team.parentTeam;

  const updatedTeam = await team.save();

  // Populate the response
  const populatedTeam = await Team.findById(updatedTeam._id)
    .populate('lead', 'name email profileImg')
    .populate('members', 'name email profileImg')
    .populate('projects', 'name status progress')
    .populate('parentTeam', 'name')
    .populate('subTeams', 'name membersCount projectsCount');

  res.json(populatedTeam);
});

// @desc    Delete a team
// @route   DELETE /api/admin/teams/:id
// @access  Private/Admin
const deleteTeam = asyncHandler(async (req, res) => {
  const team = await Team.findById(req.params.id);
  if (!team) {
    res.status(404);
    throw new Error('Team not found');
  }

  // Remove from parent's subTeams
  if (team.parentTeam) {
    await Team.findByIdAndUpdate(team.parentTeam, {
      $pull: { subTeams: team._id }
    });
  }

  // Remove team from users' team field
  await User.updateMany(
    { team: team._id },
    { $unset: { team: "" } }
  );

  // Delete the team
  await team.deleteOne();

  res.json({ message: 'Team removed successfully' });
});

// @desc    Add members to a team
// @route   PUT /api/admin/teams/:id/add-members
// @access  Private/Admin
const addTeamMembers = asyncHandler(async (req, res) => {
  const { memberIds } = req.body;

  const team = await Team.findById(req.params.id);
  if (!team) {
    res.status(404);
    throw new Error('Team not found');
  }

  // Filter out members already in the team
  const newMemberIds = memberIds.filter(id => 
    !team.members.some(memberId => memberId.toString() === id)
  );

  if (newMemberIds.length === 0) {
    res.status(400);
    throw new Error('No new members to add');
  }

  // Add to team's members
  team.members.push(...newMemberIds);
  await team.save();

  // Update users' team field
  await User.updateMany(
    { _id: { $in: newMemberIds } },
    { $set: { team: team._id } }
  );

  // Populate the response
  const populatedTeam = await Team.findById(team._id)
    .populate('members', 'name email profileImg role department');

  res.json(populatedTeam);
});

// @desc    Remove members from a team
// @route   PUT /api/admin/teams/:id/remove-members
// @access  Private/Admin
const removeTeamMembers = asyncHandler(async (req, res) => {
  const { memberIds } = req.body;

  const team = await Team.findById(req.params.id);
  if (!team) {
    res.status(404);
    throw new Error('Team not found');
  }

  // Remove members from team
  team.members = team.members.filter(
    memberId => !memberIds.includes(memberId.toString())
  );
  await team.save();

  // Remove team from users
  await User.updateMany(
    { _id: { $in: memberIds } },
    { $unset: { team: "" } }
  );

  // Populate the response
  const populatedTeam = await Team.findById(team._id)
    .populate('members', 'name email profileImg role department');

  res.json(populatedTeam);
});

module.exports = {
  getTeams,
  getTeamById,
  createTeam,
  updateTeam,
  deleteTeam,
  addTeamMembers,
  removeTeamMembers
};