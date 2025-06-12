const { signToken } = require('../utils/jwt');
const { comparePassword } = require('../utils/hash');
const { getEmployeeByUsername } = require('../models/usersModel');

async function authenticateUser(username, password) {
  const user = await getEmployeeByUsername(username);

  if (typeof user !== 'object') {
    return {
      success: false,
      status: 401,
      message: `Invalid username or password #1`,
    };
  }

  const isPasswordMatch = comparePassword(password, user.password);

  if (!isPasswordMatch) {
    return {
      success: false,
      status: 401,
      message: `Invalid username or password #2`,
    };
  }

  const token = signToken({
    id: user.id,
    username: user.username,
    role: user.role,
  });

  return {
    success: true,
    status: 200,
    message: 'Login successful',
    data: { token, role: user.role },
  };
}

module.exports = {
  authenticateUser,
};
