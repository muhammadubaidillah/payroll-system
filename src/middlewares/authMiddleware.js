const { verifyToken } = require('../utils/jwt');
const logger = require('../utils/logger');

function tokenVerification(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res
      .status(401)
      .json({ error: 'unauthorized', error_description: 'Missing or invalid token' });
  }

  const token = authHeader.split(' ')[1];
  const payload = verifyToken(token);

  if (!payload) {
    return res
      .status(401)
      .json({ error: 'unauthorized', error_description: 'Invalid or expired token' });
  }

  req.user = payload;
  next();
}

module.exports = { tokenVerification };
