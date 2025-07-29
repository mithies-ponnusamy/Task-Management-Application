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
        enum: ['to-do', 'in-progress', 'review', 'completed', 'pending'],
        default: 'to-do'
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
    }],
    
    // Enhanced file management for task requirements
    requirementFiles: [{
        id: {
            type: String,
            required: true
        },
        name: {
            type: String,
            required: true
        },
        filename: String,
        originalName: String,
        size: Number,
        type: String,
        path: String,
        url: String,
        uploadedAt: {
            type: Date,
            default: Date.now
        },
        uploadedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        }
    }],
    
    // Links for task requirements
    requirementLinks: [{
        id: {
            type: String,
            required: true
        },
        title: {
            type: String,
            required: true
        },
        url: {
            type: String,
            required: true
        },
        description: String,
        addedAt: {
            type: Date,
            default: Date.now
        },
        addedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        }
    }],
    
    // Files uploaded by team member for task completion
    completionFiles: [{
        id: {
            type: String,
            required: true
        },
        name: {
            type: String,
            required: true
        },
        filename: String,
        originalName: String,
        size: Number,
        type: String,
        path: String,
        url: String,
        uploadedAt: {
            type: Date,
            default: Date.now
        },
        uploadedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        }
    }],
    
    // Links for task completion documentation
    completionLinks: [{
        id: {
            type: String,
            required: true
        },
        title: {
            type: String,
            required: true
        },
        url: {
            type: String,
            required: true
        },
        description: String,
        addedAt: {
            type: Date,
            default: Date.now
        },
        addedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        }
    }],
    
    // Task workflow tracking
    readBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        default: null
    },
    readAt: {
        type: Date,
        default: null
    },
    
    completedAt: {
        type: Date,
        default: null
    },
    
    reviewedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        default: null
    },
    reviewedAt: {
        type: Date,
        default: null
    },
    
    reviewNotes: {
        type: String,
        trim: true,
        default: ''
    }
}, {
    timestamps: true // Adds createdAt and updatedAt automatically
});

// Add indexes for faster queries
TaskSchema.index({ assignee: 1, status: 1 });
TaskSchema.index({ project: 1, status: 1 });
TaskSchema.index({ sprint: 1, status: 1 });
TaskSchema.index({ createdBy: 1 });

module.exports = mongoose.model('Task', TaskSchema);