const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET || 'supersecretjwtkey';

const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization || req.headers.Authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    console.warn('Authorization header missing or malformed', { authHeader });
    return res.status(401).json({ success: false, message: 'Unauthorized' });
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.userId = decoded.id;
    console.debug('Token verified for userId:', req.userId);
    next();
  } catch (error) {
    console.error('Token verify error:', error);
    return res.status(401).json({ success: false, message: 'Invalid token' });
  }
};

module.exports = { verifyToken };