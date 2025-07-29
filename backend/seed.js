const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./src/models/User');
const Counter = require('./src/models/Counter');
require('dotenv').config();

const seedUsers = async () => {
    try {
        // Connect to database
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB');

        // Clear existing users and counters
        await User.deleteMany({});
        await Counter.deleteMany({});
        console.log('Cleared existing users and counters');

        // Create admin user
        const admin = new User({
            username: 'admin',
            name: 'Admin User',
            email: 'admin@genworx.ai',
            password: 'admin123',
            role: 'admin',
            status: 'active'
        });

        // Create team lead user
        const teamLead = new User({
            username: 'teamlead',
            name: 'Team Lead',
            email: 'lead@genworx.com',
            password: 'lead123',
            role: 'team-lead',
            status: 'active'
        });

        // Create member user
        const member = new User({
            username: 'member',
            name: 'Team Member',
            email: 'member@genworx.com',
            password: 'member123',
            role: 'user',
            status: 'active'
        });

        // Save users
        await admin.save();
        await teamLead.save();
        await member.save();

        console.log('✅ Seed data created successfully!');
        console.log('👤 Admin: admin@genworx.com / admin123');
        console.log('👤 Lead: lead@genworx.com / lead123');
        console.log('👤 Member: member@genworx.com / member123');

        process.exit(0);
    } catch (error) {
        console.error('❌ Error seeding data:', error);
        process.exit(1);
    }
};

seedUsers();
