function getClientIp(req) {
  return (
    req.headers['x-forwarded-for']?.split(',')[0] ||
    req.connection.remoteAddress ||
    req.socket.remoteAddress ||
    null
  );
}

module.exports = { getClientIp };
