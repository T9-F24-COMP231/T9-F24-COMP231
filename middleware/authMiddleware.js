const jwt = require('jsonwebtoken');
require('dotenv').config();

const checkUserRole = (allowedRoles) => {
  return (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ message: 'Access Denied: No Token Provided' });
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decoded; // Attach decoded user data to request

      if (allowedRoles.includes(req.user.role)) {
        return next();
      } else {
        return res.status(403).json({ message: 'Access Denied: Insufficient Permissions' });
      }
    } catch (error) {
      return res.status(401).json({ message: 'Invalid Token' });
    }
  };
};

module.exports = checkUserRole;