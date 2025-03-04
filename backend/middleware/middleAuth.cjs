const jwt = require('jsonwebtoken');

// Middleware to verify JWT
const protect = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1]; // Get token from 'Authorization' header

  if (!token) {
    return res.status(401).json({ message: 'No token, authorization denied' });
  }

  try {
    // Verify the token and decode the user data
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;  // Attach decoded user info to the request object
    next();  // Proceed to the next middleware/route handler
  } catch (error) {
    return res.status(401).json({ message: 'Invalid token' });
  }
};

module.exports = { protect };
