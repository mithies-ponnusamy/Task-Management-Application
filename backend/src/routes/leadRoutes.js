const express = require('express');
const router = express.Router();
const {
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
} = require('../controllers/leadController');
const { protect, authorize } = require('../middleware/authMiddleware');

// All routes are protected and require team lead role
router.use(protect);
router.use(authorize('team-lead', 'admin')); // Allow both team leads and admins to access

// Lead profile routes
router.route('/profile')
  .get(getLeadProfile)
  .put(updateLeadProfile);

// Lead projects - get projects assigned to the team lead
router.get('/projects', getLeadProjects);

// Lead team - get team members under this lead
router.get('/team', getLeadTeam);

// Get available users that can be added to team
router.get('/team/available-users', getAvailableUsers);

// Team member management
router.route('/team/members')
  .post(addTeamMembers)      // Add members to team
  .delete(removeTeamMembers); // Remove members from team

// Task management routes
router.route('/tasks')
  .get(getLeadTasks)    // Get all tasks for lead's projects
  .post(createTask);    // Create new task

router.route('/tasks/:id')
  .put(updateTask)      // Update existing task
  .delete(deleteTask);  // Delete task

// Sprint management routes
router.get('/sprints', getLeadSprints);           // Get sprints for lead's projects
router.put('/sprints/:id', updateSprint);        // Update sprint (limited fields)

// Dashboard statistics for the lead
router.get('/dashboard', getLeadDashboardStats);

module.exports = router;
