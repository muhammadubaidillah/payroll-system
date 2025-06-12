const config = require('../../config');
function getClientIp(req) {
  return (
    req.headers['x-forwarded-for']?.split(',')[0] ||
    req.connection.remoteAddress ||
    req.socket.remoteAddress ||
    null
  );
}

function maskSensitiveData(data) {
  if (typeof data !== 'object' || data === null) {
    return data;
  }

  const SENSITIVE_KEYS = config.sensitive.log_keys
    .split(',')
    .map((key) => key.trim())
    .filter(Boolean);

  const maskedData = { ...data };

  for (const key of SENSITIVE_KEYS) {
    if (key in maskedData) {
      maskedData[key] = '******';
    }
  }

  return maskedData;
}

module.exports = { getClientIp, maskSensitiveData };
