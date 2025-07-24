const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        // Temporarily disable strict populate for debugging
        mongoose.set('strictPopulate', false);
        
        const conn = await mongoose.connect(process.env.MONGODB_URI);
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1); // Exit process with failure
    }
};

module.exports = connectDB;