const express = require('express');
const router = express.Router();
const {
  getProjects,
  getProjectById,
  createProject,
  updateProject,
  deleteProject
} = require('../controllers/projectController');
const { protect, admin } = require('../middleware/authMiddleware');

// All routes are protected and require admin access
router.route('/')
  .get(protect, admin, getProjects)
  .post(protect, admin, createProject);

router.route('/:id')
  .get(protect, admin, getProjectById)
  .put(protect, admin, updateProject)
  .delete(protect, admin, deleteProject);

module.exports = router;
