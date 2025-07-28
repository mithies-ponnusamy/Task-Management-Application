// server.js
const express = require('express');
const dotenv = require('dotenv');
const path = require('path');
const cors = require('cors');
const connectDB = require('./config/db');
const userRoutes = require('./routes/userRoutes');
const adminRoutes = require('./routes/adminRoutes'); // Import admin routes
const leadRoutes = require('./routes/leadRoutes'); // Import lead routes
const taskRoutes = require('./routes/taskRoutes'); // Import task routes
const { notFound, errorHandler } = require('./middleware/errorMiddleware');

// Load environment variables from the correct path
dotenv.config({ path: path.join(__dirname, '..', '.env') });
connectDB();

const app = express();

app.use(cors());
app.use(express.json());

// Request logger
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path} - Body:`, req.body);
  next();
});

// Define API routes
app.use('/api/users', userRoutes);
app.use('/api/admin', adminRoutes); // Correctly mount admin routes under /api/admin/users
app.use('/api/lead', leadRoutes); // Routes for team lead functionality
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