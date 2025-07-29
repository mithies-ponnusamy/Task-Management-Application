const asyncHandler = require('express-async-handler');
const Task = require('../models/Task');
const User = require('../models/User');
const Project = require('../models/Project');
const path = require('path');
const fs = require('fs');

// @desc    Get all tasks for the authenticated user
// @route   GET /api/tasks
// @access  Private
const getTasks = asyncHandler(async (req, res) => {
    const tasks = await Task.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(tasks);
});

// @desc    Get a single task by ID for the authenticated user
// @route   GET /api/tasks/:id
// @access  Private
const getTaskById = asyncHandler(async (req, res) => {
    const task = await Task.findOne({ _id: req.params.id, user: req.user._id });

    if (task) {
        res.json(task);
    } else {
        res.status(404);
        throw new Error('Task not found');
    }
});

// @desc    Create a new task
// @route   POST /api/tasks
// @access  Private
const createTask = asyncHandler(async (req, res) => {
    const { title, description, status, priority, dueDate } = req.body;

    if (!title || !dueDate) {
        res.status(400);
        throw new Error('Please add a title and a due date');
    }

    const task = new Task({
        user: req.user._id,
        title,
        description,
        status,
        priority,
        dueDate
    });

    const createdTask = await task.save();
    res.status(201).json(createdTask);
});

// @desc    Update a task
// @route   PUT /api/tasks/:id
// @access  Private
const updateTask = asyncHandler(async (req, res) => {
    const { title, description, status, priority, dueDate } = req.body;

    const task = await Task.findOne({ _id: req.params.id, user: req.user._id });

    if (task) {
        task.title = title !== undefined ? title : task.title;
        task.description = description !== undefined ? description : task.description;
        task.status = status !== undefined ? status : task.status;
        task.priority = priority !== undefined ? priority : task.priority;
        task.dueDate = dueDate !== undefined ? dueDate : task.dueDate;

        const updatedTask = await task.save();
        res.json(updatedTask);
    } else {
        res.status(404);
        throw new Error('Task not found or you are not authorized to update this task');
    }
});

// @desc    Delete a task
// @route   DELETE /api/tasks/:id
// @access  Private
const deleteTask = asyncHandler(async (req, res) => {
    const task = await Task.findOneAndDelete({ _id: req.params.id, user: req.user._id });

    if (task) {
        res.json({ message: 'Task removed successfully' });
    } else {
        res.status(404);
        throw new Error('Task not found or you are not authorized to delete this task');
    }
});

// ================== TEAM LEAD TASK CREATION WITH FILES/LINKS ==================

// @desc    Upload requirement files to a task (Team Lead)
// @route   POST /api/tasks/:id/requirement-files
// @access  Private/Lead
const uploadTaskRequirementFiles = asyncHandler(async (req, res) => {
    const taskId = req.params.id;
    const uploadedFiles = req.files || [];

    if (!uploadedFiles || uploadedFiles.length === 0) {
        res.status(400);
        throw new Error('No files uploaded');
    }

    try {
        const task = await Task.findById(taskId).populate('project');
        
        if (!task) {
            res.status(404);
            throw new Error('Task not found');
        }

        // Check if user is the task creator (lead) or has permission
        if (task.createdBy.toString() !== req.user._id.toString()) {
            res.status(403);
            throw new Error('Not authorized to upload requirement files to this task');
        }

        // Create file objects for each uploaded file
        const newFiles = uploadedFiles.map(file => ({
            id: `req_file_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            name: file.originalname,
            filename: file.filename,
            originalName: file.originalname,
            size: file.size,
            type: file.mimetype,
            path: file.path,
            url: `/uploads/${file.filename}`,
            uploadedAt: new Date(),
            uploadedBy: req.user._id
        }));

        // Add requirement files to task
        if (!task.requirementFiles) {
            task.requirementFiles = [];
        }
        task.requirementFiles.push(...newFiles);

        await task.save();

        res.status(201).json({
            message: `${newFiles.length} requirement file(s) uploaded successfully`,
            files: newFiles,
            task: task
        });
    } catch (error) {
        console.error('Error uploading requirement files:', error);
        res.status(500).json({ message: error.message || 'Server error uploading files' });
    }
});

// @desc    Delete a requirement file from a task
// @route   DELETE /api/tasks/:id/requirement-files/:fileId
// @access  Private/Lead
const deleteTaskRequirementFile = asyncHandler(async (req, res) => {
    const { id: taskId, fileId } = req.params;

    try {
        const task = await Task.findById(taskId);

        if (!task) {
            res.status(404);
            throw new Error('Task not found');
        }

        // Check if user is the task creator (lead) or has permission
        if (task.createdBy.toString() !== req.user._id.toString()) {
            res.status(403);
            throw new Error('Not authorized to delete requirement files from this task');
        }

        // Find and remove the file
        const fileIndex = task.requirementFiles.findIndex(file => file.id === fileId);
        if (fileIndex === -1) {
            res.status(404);
            throw new Error('File not found');
        }

        const fileToDelete = task.requirementFiles[fileIndex];
        
        // Delete physical file from filesystem
        if (fileToDelete.path && fs.existsSync(fileToDelete.path)) {
            fs.unlinkSync(fileToDelete.path);
        }

        // Remove from database
        task.requirementFiles.splice(fileIndex, 1);
        await task.save();

        res.json({ message: 'Requirement file deleted successfully' });
    } catch (error) {
        console.error('Error deleting requirement file:', error);
        res.status(500).json({ message: error.message || 'Server error deleting file' });
    }
});

// @desc    Add a requirement link to a task
// @route   POST /api/tasks/:id/requirement-links
// @access  Private/Lead
const addTaskRequirementLink = asyncHandler(async (req, res) => {
    const taskId = req.params.id;
    const { url, title, description } = req.body;

    if (!url || !title) {
        res.status(400);
        throw new Error('URL and title are required');
    }

    try {
        const task = await Task.findById(taskId);

        if (!task) {
            res.status(404);
            throw new Error('Task not found');
        }

        // Check if user is the task creator (lead) or has permission
        if (task.createdBy.toString() !== req.user._id.toString()) {
            res.status(403);
            throw new Error('Not authorized to add requirement links to this task');
        }

        const newLink = {
            id: `req_link_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            title,
            url,
            description: description || '',
            addedAt: new Date(),
            addedBy: req.user._id
        };

        if (!task.requirementLinks) {
            task.requirementLinks = [];
        }
        task.requirementLinks.push(newLink);

        await task.save();

        res.status(201).json({
            message: 'Requirement link added successfully',
            link: newLink,
            task: task
        });
    } catch (error) {
        console.error('Error adding requirement link:', error);
        res.status(500).json({ message: error.message || 'Server error adding link' });
    }
});

// @desc    Delete a requirement link from a task
// @route   DELETE /api/tasks/:id/requirement-links/:linkId
// @access  Private/Lead
const deleteTaskRequirementLink = asyncHandler(async (req, res) => {
    const { id: taskId, linkId } = req.params;

    try {
        const task = await Task.findById(taskId);

        if (!task) {
            res.status(404);
            throw new Error('Task not found');
        }

        // Check if user is the task creator (lead) or has permission
        if (task.createdBy.toString() !== req.user._id.toString()) {
            res.status(403);
            throw new Error('Not authorized to delete requirement links from this task');
        }

        // Find and remove the link
        const linkIndex = task.requirementLinks.findIndex(link => link.id === linkId);
        if (linkIndex === -1) {
            res.status(404);
            throw new Error('Link not found');
        }

        task.requirementLinks.splice(linkIndex, 1);
        await task.save();

        res.json({ message: 'Requirement link deleted successfully' });
    } catch (error) {
        console.error('Error deleting requirement link:', error);
        res.status(500).json({ message: error.message || 'Server error deleting link' });
    }
});

// ================== TEAM MEMBER TASK WORKFLOW ==================

// @desc    Mark task as read and move from to-do to in-progress
// @route   PUT /api/tasks/:id/mark-as-read
// @access  Private
const markTaskAsRead = asyncHandler(async (req, res) => {
    const taskId = req.params.id;

    try {
        const task = await Task.findById(taskId);

        if (!task) {
            res.status(404);
            throw new Error('Task not found');
        }

        // Check if user is the assignee
        if (!task.assignee || task.assignee.toString() !== req.user._id.toString()) {
            res.status(403);
            throw new Error('Not authorized to mark this task as read');
        }

        // Only allow if task is in to-do status
        if (task.status !== 'to-do') {
            res.status(400);
            throw new Error('Task can only be marked as read when in to-do status');
        }

        // Update task status and read information
        task.status = 'in-progress';
        task.readBy = req.user._id;
        task.readAt = new Date();

        await task.save();

        res.json({
            message: 'Task marked as read and moved to in-progress',
            task: task
        });
    } catch (error) {
        console.error('Error marking task as read:', error);
        res.status(500).json({ message: error.message || 'Server error marking task as read' });
    }
});

// @desc    Upload completion files to a task (Team Member)
// @route   POST /api/tasks/:id/completion-files
// @access  Private
const uploadTaskCompletionFiles = asyncHandler(async (req, res) => {
    const taskId = req.params.id;
    const uploadedFiles = req.files || [];

    if (!uploadedFiles || uploadedFiles.length === 0) {
        res.status(400);
        throw new Error('No files uploaded');
    }

    try {
        const task = await Task.findById(taskId);
        
        if (!task) {
            res.status(404);
            throw new Error('Task not found');
        }

        // Check if user is the assignee
        if (!task.assignee || task.assignee.toString() !== req.user._id.toString()) {
            res.status(403);
            throw new Error('Not authorized to upload completion files to this task');
        }

        // Create file objects for each uploaded file
        const newFiles = uploadedFiles.map(file => ({
            id: `comp_file_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            name: file.originalname,
            filename: file.filename,
            originalName: file.originalname,
            size: file.size,
            type: file.mimetype,
            path: file.path,
            url: `/uploads/${file.filename}`,
            uploadedAt: new Date(),
            uploadedBy: req.user._id
        }));

        // Add completion files to task
        if (!task.completionFiles) {
            task.completionFiles = [];
        }
        task.completionFiles.push(...newFiles);

        await task.save();

        res.status(201).json({
            message: `${newFiles.length} completion file(s) uploaded successfully`,
            files: newFiles,
            task: task
        });
    } catch (error) {
        console.error('Error uploading completion files:', error);
        res.status(500).json({ message: error.message || 'Server error uploading files' });
    }
});

// @desc    Delete a completion file from a task
// @route   DELETE /api/tasks/:id/completion-files/:fileId
// @access  Private
const deleteTaskCompletionFile = asyncHandler(async (req, res) => {
    const { id: taskId, fileId } = req.params;

    try {
        const task = await Task.findById(taskId);

        if (!task) {
            res.status(404);
            throw new Error('Task not found');
        }

        // Check if user is the assignee
        if (!task.assignee || task.assignee.toString() !== req.user._id.toString()) {
            res.status(403);
            throw new Error('Not authorized to delete completion files from this task');
        }

        // Find and remove the file
        const fileIndex = task.completionFiles.findIndex(file => file.id === fileId);
        if (fileIndex === -1) {
            res.status(404);
            throw new Error('File not found');
        }

        const fileToDelete = task.completionFiles[fileIndex];
        
        // Delete physical file from filesystem
        if (fileToDelete.path && fs.existsSync(fileToDelete.path)) {
            fs.unlinkSync(fileToDelete.path);
        }

        // Remove from database
        task.completionFiles.splice(fileIndex, 1);
        await task.save();

        res.json({ message: 'Completion file deleted successfully' });
    } catch (error) {
        console.error('Error deleting completion file:', error);
        res.status(500).json({ message: error.message || 'Server error deleting file' });
    }
});

// @desc    Add a completion link to a task
// @route   POST /api/tasks/:id/completion-links
// @access  Private
const addTaskCompletionLink = asyncHandler(async (req, res) => {
    const taskId = req.params.id;
    const { url, title, description } = req.body;

    if (!url || !title) {
        res.status(400);
        throw new Error('URL and title are required');
    }

    try {
        const task = await Task.findById(taskId);

        if (!task) {
            res.status(404);
            throw new Error('Task not found');
        }

        // Check if user is the assignee
        if (!task.assignee || task.assignee.toString() !== req.user._id.toString()) {
            res.status(403);
            throw new Error('Not authorized to add completion links to this task');
        }

        const newLink = {
            id: `comp_link_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            title,
            url,
            description: description || '',
            addedAt: new Date(),
            addedBy: req.user._id
        };

        if (!task.completionLinks) {
            task.completionLinks = [];
        }
        task.completionLinks.push(newLink);

        await task.save();

        res.status(201).json({
            message: 'Completion link added successfully',
            link: newLink,
            task: task
        });
    } catch (error) {
        console.error('Error adding completion link:', error);
        res.status(500).json({ message: error.message || 'Server error adding link' });
    }
});

// @desc    Delete a completion link from a task
// @route   DELETE /api/tasks/:id/completion-links/:linkId
// @access  Private
const deleteTaskCompletionLink = asyncHandler(async (req, res) => {
    const { id: taskId, linkId } = req.params;

    try {
        const task = await Task.findById(taskId);

        if (!task) {
            res.status(404);
            throw new Error('Task not found');
        }

        // Check if user is the assignee
        if (!task.assignee || task.assignee.toString() !== req.user._id.toString()) {
            res.status(403);
            throw new Error('Not authorized to delete completion links from this task');
        }

        // Find and remove the link
        const linkIndex = task.completionLinks.findIndex(link => link.id === linkId);
        if (linkIndex === -1) {
            res.status(404);
            throw new Error('Link not found');
        }

        task.completionLinks.splice(linkIndex, 1);
        await task.save();

        res.json({ message: 'Completion link deleted successfully' });
    } catch (error) {
        console.error('Error deleting completion link:', error);
        res.status(500).json({ message: error.message || 'Server error deleting link' });
    }
});

// @desc    Move task to review status after uploading completion docs
// @route   PUT /api/tasks/:id/move-to-review
// @access  Private
const moveTaskToReview = asyncHandler(async (req, res) => {
    const taskId = req.params.id;

    try {
        const task = await Task.findById(taskId);

        if (!task) {
            res.status(404);
            throw new Error('Task not found');
        }

        // Check if user is the assignee
        if (!task.assignee || task.assignee.toString() !== req.user._id.toString()) {
            res.status(403);
            throw new Error('Not authorized to move this task to review');
        }

        // Only allow if task is in in-progress status
        if (task.status !== 'in-progress') {
            res.status(400);
            throw new Error('Task can only be moved to review when in in-progress status');
        }

        // Check if completion documentation is provided
        const hasCompletionFiles = task.completionFiles && task.completionFiles.length > 0;
        const hasCompletionLinks = task.completionLinks && task.completionLinks.length > 0;

        if (!hasCompletionFiles && !hasCompletionLinks) {
            res.status(400);
            throw new Error('Please upload completion documentation (files or links) before moving to review');
        }

        // Update task status
        task.status = 'review';
        task.completedAt = new Date();

        await task.save();

        res.json({
            message: 'Task moved to review status',
            task: task
        });
    } catch (error) {
        console.error('Error moving task to review:', error);
        res.status(500).json({ message: error.message || 'Server error moving task to review' });
    }
});

// ================== TEAM LEAD TASK REVIEW ==================

// @desc    Review task and mark as completed
// @route   PUT /api/tasks/:id/review
// @access  Private/Lead
const reviewTask = asyncHandler(async (req, res) => {
    const taskId = req.params.id;
    const { reviewNotes, approved } = req.body;

    try {
        const task = await Task.findById(taskId);

        if (!task) {
            res.status(404);
            throw new Error('Task not found');
        }

        // Check if user is the task creator (lead) or has permission to review
        if (task.createdBy.toString() !== req.user._id.toString()) {
            res.status(403);
            throw new Error('Not authorized to review this task');
        }

        // Only allow if task is in review status
        if (task.status !== 'review') {
            res.status(400);
            throw new Error('Task can only be reviewed when in review status');
        }

        // Update review information
        task.reviewedBy = req.user._id;
        task.reviewedAt = new Date();
        task.reviewNotes = reviewNotes || '';

        if (approved) {
            task.status = 'completed';
        } else {
            // If not approved, send back to in-progress
            task.status = 'in-progress';
        }

        await task.save();

        res.json({
            message: approved ? 'Task approved and marked as completed' : 'Task sent back to in-progress for revision',
            task: task
        });
    } catch (error) {
        console.error('Error reviewing task:', error);
        res.status(500).json({ message: error.message || 'Server error reviewing task' });
    }
});

// ================== TASK QUERYING ==================

// @desc    Get tasks by assignee (for team member view)
// @route   GET /api/tasks/assignee/:userId
// @access  Private
const getTasksByAssignee = asyncHandler(async (req, res) => {
    const assigneeId = req.params.userId;

    try {
        // Users can only see their own tasks unless they're a lead/admin
        if (req.user._id.toString() !== assigneeId && req.user.role !== 'lead' && req.user.role !== 'admin') {
            res.status(403);
            throw new Error('Not authorized to view these tasks');
        }

        const tasks = await Task.find({ assignee: assigneeId })
            .populate('createdBy', 'name email')
            .populate('assignee', 'name email')
            .populate('project', 'name')
            .populate('sprint', 'name')
            .sort({ createdAt: -1 });

        res.json(tasks);
    } catch (error) {
        console.error('Error getting tasks by assignee:', error);
        res.status(500).json({ message: error.message || 'Server error getting tasks' });
    }
});

// @desc    Get tasks for lead review (created by lead)
// @route   GET /api/tasks/lead
// @access  Private/Lead
const getTasksForLead = asyncHandler(async (req, res) => {
    try {
        const tasks = await Task.find({ createdBy: req.user._id })
            .populate('createdBy', 'name email')
            .populate('assignee', 'name email')
            .populate('project', 'name')
            .populate('sprint', 'name')
            .sort({ createdAt: -1 });

        res.json(tasks);
    } catch (error) {
        console.error('Error getting tasks for lead:', error);
        res.status(500).json({ message: error.message || 'Server error getting tasks' });
    }
});

module.exports = {
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
};