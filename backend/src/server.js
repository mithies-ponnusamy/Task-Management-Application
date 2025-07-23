// server.js
const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');
const userRoutes = require('./routes/userRoutes');
const adminRoutes = require('./routes/adminRoutes'); // Import admin routes
const taskRoutes = require('./routes/taskRoutes'); // Import task routes
const { notFound, errorHandler } = require('./middleware/errorMiddleware');

dotenv.config();
connectDB();

const app = express();

app.use(cors());
app.use(express.json());

// Define API routes
app.use('/api/users', userRoutes);
app.use('/api/admin', adminRoutes); // Correctly mount admin routes under /api/admin/users
app.use('/api/tasks', taskRoutes); // Routes for task management

// Basic route for the root URL
app.get('/', (req, res) => {
  res.send('User Management API is running...');
});

// Custom error handling middleware
app.use(notFound); // Handles 404 Not Found errors
app.use(errorHandler); // Centralized error handler

const PORT = process.env.PORT || 5000; // Define server port
app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});