const express = require('express');
const router = express.Router();
const { registerUser, loginUser, getUserProfile, updateUserProfile } = require('../controllers/userController');
const { 
  markTaskAsRead, 
  markTaskAsCompleted 
} = require('../controllers/leadController');
const { protect } = require('../middleware/authMiddleware');
const Project = require('../models/Project');
const Task = require('../models/Task');

router.post('/register', registerUser);
router.post('/login', loginUser);
router.route('/profile')
  .get(protect, getUserProfile)    // Get user profile
  .put(protect, updateUserProfile); // Update user profile

// Get projects assigned to the user's team
router.get('/my-projects', protect, async (req, res) => {
  try {
    // Get the user's team ID
    const userTeamId = req.user.team;
    
    if (!userTeamId) {
      return res.status(400).json({ message: 'User is not assigned to any team' });
    }

    // Find projects assigned to the user's team
    const projects = await Project.find({ team: userTeamId })
      .populate('team', 'name')
      .populate('teamMembers', 'name email');
    
    res.json(projects);
  } catch (error) {
    console.error('Error fetching user projects:', error);
    res.status(500).json({ message: 'Error fetching projects', error: error.message });
  }
});

// Get tasks assigned to the current user
router.get('/my-tasks', protect, async (req, res) => {
  try {
    // Find tasks where the assignee matches the current user's ID
    const tasks = await Task.find({ assignee: req.user._id })
      .populate('assignee', 'name email')
      .populate('project', 'name') // Changed from 'projectId' to 'project'
      .populate('sprint', 'name'); // Changed from 'sprintId' to 'sprint'
    
    res.json(tasks);
  } catch (error) {
    console.error('Error fetching user tasks:', error);
    res.status(500).json({ message: 'Error fetching tasks', error: error.message });
  }
});

// Task workflow routes for team members
router.put('/tasks/:id/mark-read', protect, markTaskAsRead);        // Team member marks task as read
router.put('/tasks/:id/mark-completed', protect, markTaskAsCompleted); // Team member marks task as completed

module.exports = router;

module.exports = router;