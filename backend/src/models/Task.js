const mongoose = require('mongoose');

const TaskSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    title: {
        type: String,
        required: [true, 'Please add a title for the task'],
        trim: true,
        minlength: 3
    },
    description: {
        type: String,
        trim: true,
        default: ''
    },
    status: {
        type: String,
        enum: ['pending', 'in-progress', 'done'],
        default: 'pending'
    },
    priority: {
        type: String,
        enum: ['low', 'medium', 'high'],
        default: 'medium'
    },
    dueDate: {
        type: Date,
        required: [true, 'Please add a due date for the task']
    },
}, {
    timestamps: true // Adds createdAt and updatedAt automatically
});

// Optional: Add an index for faster queries by user and status
TaskSchema.index({ user: 1, status: 1 });

module.exports = mongoose.model('Task', TaskSchema);