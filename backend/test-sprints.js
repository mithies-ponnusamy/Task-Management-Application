const mongoose = require('mongoose');
require('dotenv').config();

// Import models
const User = require('./src/models/User');
const Project = require('./src/models/Project');
const Sprint = require('./src/models/Sprint');
const Team = require('./src/models/Team');

async function testSprintFetching() {
    try {
        // Connect to MongoDB
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB');

        // Find all team leads
        const teamLeads = await User.find({ role: 'team-lead' }).populate('team');
        console.log('\n=== Team Leads ===');
        for (const lead of teamLeads) {
            console.log(`Lead: ${lead.name} (${lead.email})`);
            console.log(`Team: ${lead.team ? lead.team.name : 'No team assigned'}`);
            console.log(`Team ID: ${lead.team ? lead.team._id : 'N/A'}`);
            console.log('---');
        }

        if (teamLeads.length === 0) {
            console.log('No team leads found in database');
            return;
        }

        // Use the first team lead for testing
        const testLead = teamLeads[0];
        console.log(`\n=== Testing with Lead: ${testLead.name} ===`);

        // Find projects for this lead
        const projectFilter = {
            $or: [
                { lead: testLead._id },
                { team: testLead.team?._id }
            ]
        };

        const projects = await Project.find(projectFilter)
            .populate('team', 'name')
            .populate('lead', 'name');

        console.log('\n=== Projects for this Lead ===');
        for (const project of projects) {
            console.log(`Project: ${project.name}`);
            console.log(`Project ID: ${project._id}`);
            console.log(`Team: ${project.team ? project.team.name : 'No team'}`);
            console.log(`Lead: ${project.lead ? project.lead.name : 'No lead'}`);
            console.log('---');
        }

        const projectIds = projects.map(p => p._id);
        console.log(`\nProject IDs: ${projectIds}`);

        // Find sprints for these projects
        const sprintFilter = { project: { $in: projectIds } };
        const sprints = await Sprint.find(sprintFilter)
            .populate('project', 'name')
            .populate('tasks');

        console.log('\n=== Sprints for these Projects ===');
        for (const sprint of sprints) {
            console.log(`Sprint: ${sprint.name}`);
            console.log(`Sprint ID: ${sprint._id}`);
            console.log(`Project: ${sprint.project ? sprint.project.name : 'No project'}`);
            console.log(`Project ID: ${sprint.project ? sprint.project._id : 'N/A'}`);
            console.log(`Status: ${sprint.status}`);
            console.log(`Tasks: ${sprint.tasks ? sprint.tasks.length : 0}`);
            console.log('---');
        }

        console.log(`\nTotal sprints found: ${sprints.length}`);

        // Check all sprints in database
        const allSprints = await Sprint.find().populate('project', 'name');
        console.log('\n=== All Sprints in Database ===');
        for (const sprint of allSprints) {
            console.log(`Sprint: ${sprint.name}`);
            console.log(`Project: ${sprint.project ? sprint.project.name : 'No project'}`);
            console.log(`Project ID: ${sprint.project ? sprint.project._id : 'N/A'}`);
            console.log('---');
        }

    } catch (error) {
        console.error('Error:', error);
    } finally {
        await mongoose.disconnect();
        console.log('Disconnected from MongoDB');
    }
}

testSprintFetching();
