const { verifyToken } = require('../utils/jwt');
const logger = require('../utils/logger');

function tokenVerification(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ success: false, message: 'Missing or invalid token' });
  }

  const token = authHeader.split(' ')[1];
  const payload = verifyToken(token);

  if (!payload) {
    return res.status(401).json({ success: false, message: 'Invalid or expired token' });
  }

  res.locals.user = payload;
  next();
}

module.exports = { tokenVerification };
