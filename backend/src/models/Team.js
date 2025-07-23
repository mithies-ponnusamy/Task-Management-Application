const mongoose = require('mongoose');

const TeamSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    minlength: 3
  },
  department: {
    type: String,
    required: true,
    trim: true
  },
  lead: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  members: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  projects: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project'
  }],
  completionRate: {
    type: Number,
    default: 0
  },
  description: {
    type: String,
    trim: true
  },
  parentTeam: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Team',
    default: null
  },
  subTeams: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Team'
  }],
}, {
  timestamps: true,
  toJSON: {
    virtuals: true,
    transform: function(doc, ret) {
      ret.id = ret._id;
      delete ret._id;
      delete ret.__v;
    }
  },
  toObject: {
    virtuals: true
  }
});

// Virtual for member count
TeamSchema.virtual('membersCount').get(function() {
  return this.members ? this.members.length : 0;
});

// Virtual for project count
TeamSchema.virtual('projectsCount').get(function() {
  return this.projects ? this.projects.length : 0;
});

// Pre-save hook to update member and project counts
TeamSchema.pre('save', function(next) {
  this.membersCount = this.members.length;
  this.projectsCount = this.projects.length;
  next();
});

module.exports = mongoose.model('Team', TeamSchema);