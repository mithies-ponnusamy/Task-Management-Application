const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const Team = require('../models/Team');
const Project = require('../models/Project');
const Counter = require('../models/Counter');

const seedUsers = async () => {
  try {
    // Clear existing data
    await User.deleteMany({});
    await Team.deleteMany({});
    await Project.deleteMany({});
    await Counter.deleteMany({});
    
    // Initialize counter for user numerical IDs
    await Counter.create({ _id: 'user', seq: 100 });
    
    // Create admin user
    const adminUser = await User.create({
      name: 'Admin User',
      username: 'admin',
      email: 'admin@genworx.ai',
      password: '@admin123',
      role: 'admin',
      status: 'active',
      department: 'Management',
      employeeType: 'full-time',
      location: 'office'
    });

    // Create team lead user
    const leadUser = await User.create({
      name: 'Team Lead',
      username: 'teamlead',
      email: 'lead@genworx.com',
      password: 'lead123',
      role: 'team-lead',
      status: 'active',
      department: 'Development',
      employeeType: 'full-time',
      location: 'office'
    });

    // Create regular users
    const user1 = await User.create({
      name: 'John Doe',
      username: 'johndoe',
      email: 'john@genworx.com',
      password: 'user123',
      role: 'user',
      status: 'active',
      department: 'Development',
      employeeType: 'full-time',
      location: 'office'
    });

    const user2 = await User.create({
      name: 'Jane Smith',
      username: 'janesmith',
      email: 'jane@genworx.com',
      password: 'user123',
      role: 'user',
      status: 'active',
      department: 'Design',
      employeeType: 'full-time',
      location: 'office'
    });

    // Create a sample team
    const devTeam = await Team.create({
      name: 'Development Team',
      department: 'Development',
      lead: leadUser._id,
      members: [leadUser._id, user1._id],
      description: 'Main development team for the application'
    });

    const designTeam = await Team.create({
      name: 'Design Team',
      department: 'Design',
      lead: null,
      members: [user2._id],
      description: 'UI/UX design team'
    });

    // Update users with team assignments
    await User.findByIdAndUpdate(leadUser._id, { team: devTeam._id });
    await User.findByIdAndUpdate(user1._id, { team: devTeam._id });
    await User.findByIdAndUpdate(user2._id, { team: designTeam._id });

    // Create sample projects
    const project1 = await Project.create({
      name: 'Genflow Task Management',
      description: 'A comprehensive task management application with sprint functionality',
      team: devTeam._id,
      lead: leadUser._id,
      status: 'in-progress',
      priority: 'high',
      budget: 50000,
      startDate: new Date('2024-01-01'),
      deadline: new Date('2024-12-31'),
      technologies: ['Node.js', 'Angular', 'MongoDB'],
      requirements: [
        'User authentication and authorization',
        'Project and sprint management',
        'Task tracking and assignment',
        'Team collaboration tools'
      ]
    });

    const project2 = await Project.create({
      name: 'Website Redesign',
      description: 'Complete redesign of company website with modern UI/UX',
      team: designTeam._id,
      lead: null,
      status: 'not-started',
      priority: 'medium',
      budget: 25000,
      startDate: new Date('2024-06-01'),
      deadline: new Date('2024-09-30'),
      technologies: ['React', 'TailwindCSS', 'Next.js'],
      requirements: [
        'Modern responsive design',
        'Improved user experience',
        'SEO optimization',
        'Performance improvements'
      ]
    });

    console.log('✅ Seed data created successfully!');
    console.log('📧 Admin credentials: admin@genworx.ai / @admin123');
    console.log('📧 Team Lead credentials: lead@genworx.com / lead123');
    console.log('📧 User credentials: john@genworx.com / user123');
    console.log('📧 User credentials: jane@genworx.com / user123');
    console.log('📁 Projects created:', project1.name, 'and', project2.name);

  } catch (error) {
    console.error('❌ Error seeding data:', error);
  }
};

module.exports = { seedUsers };

// If running this script directly
if (require.main === module) {
  require('dotenv').config();
  const connectDB = require('../config/db');
  
  const runSeed = async () => {
    try {
      await connectDB();
      await seedUsers();
      console.log('🎉 Seed script completed successfully!');
      process.exit(0);
    } catch (error) {
      console.error('❌ Seed script failed:', error);
      process.exit(1);
    }
  };
  
  runSeed();
}
