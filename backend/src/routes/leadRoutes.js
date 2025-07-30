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
  // Task workflow
  markTaskAsRead,
  markTaskAsCompleted,
  acceptTask,
  rejectTask,
  // Sprint management
  getLeadSprints,
  updateSprint
} = require('../controllers/leadController');
const {
  // Import task file management methods from taskController
  uploadTaskRequirementFiles,
  deleteTaskRequirementFile,
  addTaskRequirementLink,
  deleteTaskRequirementLink,
  reviewTask
} = require('../controllers/taskController');
const { protect, authorize } = require('../middleware/authMiddleware');
const uploadMiddleware = require('../middleware/uploadMiddleware');

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
  .post((req, res, next) => {
    console.log('=== Route reached: POST /team/members ===');
    console.log('Request body:', req.body);
    next();
  }, addTeamMembers)      // Add members to team
  .delete(removeTeamMembers); // Remove members from team

// Task management routes
router.route('/tasks')
  .get(getLeadTasks)    // Get all tasks for lead's projects
  .post(createTask);    // Create new task

router.route('/tasks/:id')
  .put(updateTask)      // Update existing task
  .delete(deleteTask);  // Delete task

// Task workflow routes
router.put('/tasks/:id/mark-read', markTaskAsRead);        // Team member marks task as read
router.put('/tasks/:id/mark-completed', markTaskAsCompleted); // Team member marks task as completed
router.put('/tasks/:id/accept', acceptTask);              // Team lead accepts task
router.put('/tasks/:id/reject', rejectTask);              // Team lead rejects task

// Task requirement files management (Team Lead)
router.post('/tasks/:id/requirement-files', 
    uploadMiddleware.uploadMultiple,
    uploadTaskRequirementFiles
);
router.delete('/tasks/:id/requirement-files/:fileId', deleteTaskRequirementFile);

// Task requirement links management (Team Lead)
router.post('/tasks/:id/requirement-links', addTaskRequirementLink);
router.delete('/tasks/:id/requirement-links/:linkId', deleteTaskRequirementLink);

// Task review (Team Lead)
router.put('/tasks/:id/review', reviewTask);

// Sprint management routes
router.get('/sprints', getLeadSprints);           // Get sprints for lead's projects
router.put('/sprints/:id', updateSprint);        // Update sprint (limited fields)

// Dashboard statistics for the lead
router.get('/dashboard', getLeadDashboardStats);

module.exports = router;
