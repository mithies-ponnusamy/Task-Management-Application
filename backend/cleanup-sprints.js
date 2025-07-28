const mongoose = require('mongoose');
require('dotenv').config();

// Import models
const Sprint = require('./src/models/Sprint');
const Project = require('./src/models/Project');

async function cleanupInvalidSprints() {
    try {
        // Connect to MongoDB
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB');

        // Find all sprints
        const allSprints = await Sprint.find().populate('project', 'name');
        console.log(`\n=== Found ${allSprints.length} total sprints ===`);

        let invalidSprints = [];
        let validSprints = [];

        for (const sprint of allSprints) {
            if (!sprint.project) {
                invalidSprints.push(sprint);
                console.log(`❌ INVALID: Sprint "${sprint.name}" (ID: ${sprint._id}) has no project`);
            } else {
                validSprints.push(sprint);
                console.log(`✅ VALID:   Sprint "${sprint.name}" -> Project "${sprint.project.name}"`);
            }
        }

        console.log(`\n=== Summary ===`);
        console.log(`Valid sprints: ${validSprints.length}`);
        console.log(`Invalid sprints: ${invalidSprints.length}`);

        if (invalidSprints.length > 0) {
            console.log(`\n=== Cleaning up invalid sprints ===`);
            for (const sprint of invalidSprints) {
                console.log(`Deleting sprint: ${sprint.name} (ID: ${sprint._id})`);
                await Sprint.findByIdAndDelete(sprint._id);
            }
            console.log(`✅ Deleted ${invalidSprints.length} invalid sprints`);
        } else {
            console.log(`✅ No invalid sprints found - database is clean!`);
        }

        // Verify remaining sprints
        const remainingSprints = await Sprint.find().populate('project', 'name');
        console.log(`\n=== After cleanup: ${remainingSprints.length} sprints remaining ===`);
        for (const sprint of remainingSprints) {
            console.log(`✅ "${sprint.name}" -> "${sprint.project.name}"`);
        }

    } catch (error) {
        console.error('Error:', error);
    } finally {
        await mongoose.disconnect();
        console.log('\nDisconnected from MongoDB');
    }
}

cleanupInvalidSprints();
