// middleware/authMiddleware.js
const jwt = require('jsonwebtoken'); // Assuming you're using jsonwebtoken
const asyncHandler = require('express-async-handler'); // For async error handling
const User = require('../models/User'); // Import User model

const protect = asyncHandler(async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // Get token from header
      token = req.headers.authorization.split(' ')[1];

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Attach user from token to the request object (excluding password)
      req.user = await User.findById(decoded.id).select('-password');

      if (!req.user) {
        res.status(401); // User not found (e.g., deleted after token issued)
        throw new Error('Not authorized, user not found');
      }

      next(); // Proceed to the next middleware/route handler
    } catch (error) {
      console.error(error);
      res.status(401);
      throw new Error('Not authorized, token failed');
    }
  }

  if (!token) {
    res.status(401);
    throw new Error('Not authorized, no token');
  }
});

const admin = (req, res, next) => {
  // Check if req.user exists and has the 'admin' role
  if (req.user && req.user.role === 'admin') {
    next(); // User is an admin, proceed
  } else {
    res.status(403); // Forbidden
    throw new Error('Not authorized as an admin');
  }
};

module.exports = {
  protect,
  admin
};