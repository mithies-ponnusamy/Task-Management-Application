// adminRoutes.js - Fixed route mapping
const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const authMiddleware = require('../middleware/authMiddleware');
const uploadMiddleware = require('../middleware/uploadMiddleware');
const teamController = require('../controllers/teamController'); 
const projectController = require('../controllers/projectController'); 
const sprintController = require('../controllers/sprintController'); 

// Gateway health check route
router.get('/gateway-test', (req, res) => {
  res.json({
    success: true,
    message: 'API Gateway is working correctly',
    timestamp: new Date().toISOString(),
    route: 'admin/gateway-test'
  });
});

// User Management Routes
// GET all users (protected, admin only)
router.get('/users',
  authMiddleware.protect, // Ensures user is authenticated
  authMiddleware.admin,   // Ensures authenticated user is an admin
  adminController.getUsers
);

// GET single user by ID (protected, admin only)
router.get('/users/:id',
  authMiddleware.protect,
  authMiddleware.admin,
  adminController.getUserById
);

// POST create a user (protected, admin only)
router.post('/users',
  authMiddleware.protect,
  authMiddleware.admin,
  adminController.createUser
);

// PUT update a user (protected, admin only)
router.put('/users/:id',
  authMiddleware.protect,
  authMiddleware.admin,
  adminController.updateUser
);

// DELETE a user (protected, admin only)
router.delete('/users/:id',
  authMiddleware.protect,
  authMiddleware.admin,
  adminController.deleteUser
);

// GET all tasks (protected, admin only)
router.get('/tasks',
  authMiddleware.protect,
  authMiddleware.admin,
  adminController.getAllTasks
);

// Team Management Routes
router.get('/teams', authMiddleware.protect, authMiddleware.admin, teamController.getTeams);
router.get('/teams/:id', authMiddleware.protect, authMiddleware.admin, teamController.getTeamById);
router.post('/teams', authMiddleware.protect, authMiddleware.admin, teamController.createTeam);
router.put('/teams/:id', authMiddleware.protect, authMiddleware.admin, teamController.updateTeam);
router.delete('/teams/:id', authMiddleware.protect, authMiddleware.admin, teamController.deleteTeam);
router.put('/teams/:id/add-members', authMiddleware.protect, authMiddleware.admin, teamController.addTeamMembers);
router.put('/teams/:id/remove-members', authMiddleware.protect, authMiddleware.admin, teamController.removeTeamMembers);

// Project Management Routes
router.get('/projects', authMiddleware.protect, authMiddleware.admin, projectController.getProjects);
router.get('/projects/:id', authMiddleware.protect, authMiddleware.admin, projectController.getProjectById);
router.post('/projects', authMiddleware.protect, authMiddleware.admin, projectController.createProject);
router.put('/projects/:id', authMiddleware.protect, authMiddleware.admin, projectController.updateProject);
router.delete('/projects/:id', authMiddleware.protect, authMiddleware.admin, projectController.deleteProject);

// Project File Management Routes
router.post('/projects/:id/files', 
  authMiddleware.protect, 
  authMiddleware.admin, 
  uploadMiddleware.uploadMultiple,
  projectController.uploadProjectFiles
);
router.delete('/projects/:id/files/:fileId', authMiddleware.protect, authMiddleware.admin, projectController.deleteProjectFile);

// Project Link Management Routes
router.post('/projects/:id/links', authMiddleware.protect, authMiddleware.admin, projectController.addProjectLink);
router.delete('/projects/:id/links/:linkId', authMiddleware.protect, authMiddleware.admin, projectController.deleteProjectLink);

// Sprint Management Routes
router.get('/sprints', authMiddleware.protect, authMiddleware.admin, sprintController.getSprints);
router.get('/sprints/:id', authMiddleware.protect, authMiddleware.admin, sprintController.getSprintById);
router.post('/sprints', authMiddleware.protect, authMiddleware.admin, sprintController.createSprint);
router.put('/sprints/:id', authMiddleware.protect, authMiddleware.admin, sprintController.updateSprint);
router.delete('/sprints/:id', authMiddleware.protect, authMiddleware.admin, sprintController.deleteSprint);
router.get('/sprints/project/:projectId', authMiddleware.protect, authMiddleware.admin, sprintController.getSprintsByProject);

module.exports = router;