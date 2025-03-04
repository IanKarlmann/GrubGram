const jwt = require('jsonwebtoken');

// Middleware to verify JWT
const protect = (req, res, next) => {
  console.log('Full Authorization Header:', req.headers.authorization);
  
  const token = req.headers.authorization?.split(" ")[1];

  console.log('Extracted Token:', {
    token: token,
    exists: !!token,
    length: token ? token.length : 'N/A'
  });

  if (!token) {
    return res.status(401).json({ 
      message: 'No token, authorization denied',
      fullHeaders: req.headers
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    console.error('Token Verification Error:', {
      name: error.name,
      message: error.message
    });
    return res.status(401).json({ 
      message: 'Invalid token',
      errorDetails: error.message 
    });
  }
};

module.exports = { protect };
