const mongoose = require('mongoose');

const TaskSchema = new mongoose.Schema({
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
    assignee: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        default: null
    },
    project: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Project',
        required: true
    },
    sprint: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Sprint',
        default: null
    },
    status: {
        type: String,
        enum: ['todo', 'in-progress', 'done', 'pending'],
        default: 'todo'
    },
    priority: {
        type: String,
        enum: ['low', 'medium', 'high'],
        default: 'medium'
    },
    dueDate: {
        type: Date,
        default: null
    },
    storyPoints: {
        type: Number,
        min: 1,
        max: 13,
        default: 1
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    comments: [{
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        text: {
            type: String,
            required: true
        },
        createdAt: {
            type: Date,
            default: Date.now
        }
    }],
    attachments: [{
        name: String,
        url: String,
        uploadedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        uploadedAt: {
            type: Date,
            default: Date.now
        }
    }]
}, {
    timestamps: true // Adds createdAt and updatedAt automatically
});

// Add indexes for faster queries
TaskSchema.index({ assignee: 1, status: 1 });
TaskSchema.index({ project: 1, status: 1 });
TaskSchema.index({ sprint: 1, status: 1 });
TaskSchema.index({ createdBy: 1 });

module.exports = mongoose.model('Task', TaskSchema);