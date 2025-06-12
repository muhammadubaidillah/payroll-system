const { authenticateUser } = require('../services/authService');

async function login(req, res, next) {
  const { username, password } = req.body;
  const { response } = res.locals;

  const result = await authenticateUser(username, password);

  if (result.success) {
    response.status = result.status;
    response.success = result.success;
    response.message = result.message;
    response.data = result.data;
  } else {
    response.status = result.status;
    response.success = result.success;
    response.message = result.message;
  }

  next();
}

module.exports = {
  login,
};
