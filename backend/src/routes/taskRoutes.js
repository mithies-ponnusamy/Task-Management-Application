const express = require('express');
const router = express.Router();
const {
    getTasks,
    getTaskById,
    createTask,
    updateTask,
    deleteTask,
    
    // Enhanced task management methods
    uploadTaskRequirementFiles,
    deleteTaskRequirementFile,
    addTaskRequirementLink,
    deleteTaskRequirementLink,
    markTaskAsRead,
    uploadTaskCompletionFiles,
    deleteTaskCompletionFile,
    addTaskCompletionLink,
    deleteTaskCompletionLink,
    moveTaskToReview,
    reviewTask,
    getTasksByAssignee,
    getTasksForLead
} = require('../controllers/taskController');
const { protect, lead, admin } = require('../middleware/authMiddleware');
const uploadMiddleware = require('../middleware/uploadMiddleware');

// All task routes are protected
router.route('/').get(protect, getTasks).post(protect, createTask);
router
    .route('/:id')
    .get(protect, getTaskById)
    .put(protect, updateTask)
    .delete(protect, deleteTask);

// ================== TEAM LEAD TASK CREATION WITH FILES/LINKS ==================
// Task requirement files management (Team Lead)
router.post('/:id/requirement-files', 
    protect, 
    uploadMiddleware.uploadMultiple,
    uploadTaskRequirementFiles
);
router.delete('/:id/requirement-files/:fileId', protect, deleteTaskRequirementFile);

// Task requirement links management (Team Lead)
router.post('/:id/requirement-links', protect, addTaskRequirementLink);
router.delete('/:id/requirement-links/:linkId', protect, deleteTaskRequirementLink);

// ================== TEAM MEMBER TASK WORKFLOW ==================
// Mark task as read (Team Member)
router.put('/:id/mark-as-read', protect, markTaskAsRead);

// Task completion files management (Team Member)
router.post('/:id/completion-files', 
    protect, 
    uploadMiddleware.uploadMultiple,
    uploadTaskCompletionFiles
);
router.delete('/:id/completion-files/:fileId', protect, deleteTaskCompletionFile);

// Task completion links management (Team Member)
router.post('/:id/completion-links', protect, addTaskCompletionLink);
router.delete('/:id/completion-links/:linkId', protect, deleteTaskCompletionLink);

// Move task to review (Team Member)
router.put('/:id/move-to-review', protect, moveTaskToReview);

// ================== TEAM LEAD TASK REVIEW ==================
// Review task (Team Lead)
router.put('/:id/review', protect, reviewTask);

// ================== TASK QUERYING ==================
// Get tasks by assignee (for team member view)
router.get('/assignee/:userId', protect, getTasksByAssignee);

// Get tasks for lead review
router.get('/lead/my-tasks', protect, getTasksForLead);

module.exports = router;