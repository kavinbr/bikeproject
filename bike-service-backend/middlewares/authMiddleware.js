const jwt = require('jsonwebtoken');
const User = require('../models/User'); // Import your User model or schema

const protect = async (req, res, next) => {
  let token;

  // Check if Authorization header is present and formatted correctly
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // Extract token from Authorization header
      token = req.headers.authorization.split(' ')[1];

      // Verify JWT token with your JWT_SECRET
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Fetch user details from database based on decoded user id
      req.user = await User.findById(decoded.id).select('-password');

      // Call next middleware or route handler if token is verified
      next();
    } catch (error) {
      // Handle token verification failure
      console.error('Token verification failed:', error);
      res.status(401).json({ message: 'Not authorized, token failed' });
    }
  }

  // Handle case where no token is provided
  if (!token) {
    res.status(401).json({ message: 'Not authorized, no token' });
  }
};

module.exports = protect;
