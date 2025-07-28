const mongoose = require('mongoose');
require('dotenv').config();

// Import models
const User = require('./src/models/User');
const Project = require('./src/models/Project');
const Team = require('./src/models/Team');

async function testLeadGetProjects() {
    try {
        // Connect to MongoDB
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB');

        // Find the first team lead
        const teamLead = await User.findOne({ role: 'team-lead' }).populate('team');
        
        if (!teamLead) {
            console.log('No team lead found');
            return;
        }

        console.log(`\n=== Testing with Lead: ${teamLead.name} ===`);
        console.log(`Team: ${teamLead.team ? teamLead.team.name : 'No team'}`);
        console.log(`Team ID: ${teamLead.team ? teamLead.team._id : 'N/A'}`);

        // Simulate the exact query from leadGetProjects
        const projectFilter = {
            $or: [
                { lead: teamLead._id },
                { team: teamLead.team?._id }
            ]
        };

        console.log('\n=== Project Filter ===');
        console.log(JSON.stringify(projectFilter, null, 2));

        const projects = await Project.find(projectFilter)
            .populate('team', 'name department')
            .populate('lead', 'name email profileImg')
            .populate('teamMembers', 'name email profileImg role')
            .sort({ createdAt: -1 })
            .lean();

        console.log('\n=== Raw Projects from DB ===');
        console.log(`Found ${projects.length} projects`);
        
        for (const project of projects) {
            console.log('\n--- Project ---');
            console.log(`ID: ${project._id}`);
            console.log(`Name: ${project.name}`);
            console.log(`Team: ${project.team ? project.team.name : 'No team'}`);
            console.log(`Lead: ${project.lead ? project.lead.name : 'No lead'}`);
            console.log(`Created: ${project.createdAt}`);
        }

        // Test how frontend would process this data
        console.log('\n=== Frontend Processing Simulation ===');
        const processedProjects = projects.map(project => ({
            ...project,
            id: project._id || project.id
        }));

        for (const project of processedProjects) {
            console.log(`Processed - ID: ${project.id}, Name: ${project.name}`);
        }

    } catch (error) {
        console.error('Error:', error);
    } finally {
        await mongoose.disconnect();
        console.log('\nDisconnected from MongoDB');
    }
}

testLeadGetProjects();
