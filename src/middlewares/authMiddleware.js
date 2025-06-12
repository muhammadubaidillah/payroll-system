const { verifyToken } = require('../utils/jwt');
const logger = require('../utils/logger');

function tokenVerification(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    logger.warn('Access denied. No token provided or malformed header.');
    return res.status(401).json({ success: false, message: 'Access denied. No token provided.' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const payload = verifyToken(token);

    if (!payload) {
      return res.status(401).json({ success: false, message: 'Invalid or expired token' });
    }

    res.locals.user = payload;

    next();
  } catch (error) {
    logger.error(`Invalid token: ${error.message}`);
    res.status(400).json({ success: false, message: 'Invalid token.' });
  }
}

module.exports = { tokenVerification };
