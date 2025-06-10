const { authenticateUser } = require('../services/authService');

async function login(req, res) {
  const { username, password } = req.body;

  const result = await authenticateUser(username, password);

  if (!result) {
    return res
      .status(401)
      .json({ error: 'Unauthorized', error_description: 'Invalid username or password' });
  }

  res.status(200).json({ message: 'Login successful', token: result.token, role: result.role });
}

module.exports = {
  login,
};
