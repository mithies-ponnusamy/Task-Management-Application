const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  assignee: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  dueDate: {
    type: Date,
    required: true
  },
  status: {
    type: String,
    enum: ['todo', 'in-progress', 'done'],
    default: 'todo'
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high'],
    default: 'medium'
  },
  estimatedHours: {
    type: Number,
    default: 0,
    min: 0
  },
  description: {
    type: String,
    trim: true
  }
}, { _id: false });

const sprintSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  project: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project',
    required: true
  },
  status: {
    type: String,
    enum: ['upcoming', 'active', 'completed', 'cancelled'],
    default: 'upcoming'
  },
  startDate: {
    type: Date,
    required: true
  },
  endDate: {
    type: Date,
    required: true
  },
  goal: {
    type: String,
    trim: true
  },
  tasks: [taskSchema],
  stats: {
    tasksCompleted: {
      type: Number,
      default: 0
    },
    totalTasks: {
      type: Number,
      default: 0
    },
    timeSpent: {
      type: Number,
      default: 0
    },
    estimatedTime: {
      type: Number,
      default: 0
    }
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
});

// Index for better query performance
sprintSchema.index({ project: 1, status: 1 });
sprintSchema.index({ startDate: 1, endDate: 1 });

// Virtual for calculating sprint progress
sprintSchema.virtual('progress').get(function() {
  if (this.stats.totalTasks === 0) return 0;
  return Math.round((this.stats.tasksCompleted / this.stats.totalTasks) * 100);
});

// Pre-save middleware to update stats
sprintSchema.pre('save', function(next) {
  if (this.tasks && this.tasks.length > 0) {
    this.stats.totalTasks = this.tasks.length;
    this.stats.tasksCompleted = this.tasks.filter(task => task.status === 'done').length;
    this.stats.estimatedTime = this.tasks.reduce((total, task) => total + (task.estimatedHours || 0), 0);
  }
  next();
});

// Ensure virtual fields are serialized
sprintSchema.set('toJSON', { virtuals: true });
sprintSchema.set('toObject', { virtuals: true });

const Sprint = mongoose.model('Sprint', sprintSchema);

module.exports = Sprint;
