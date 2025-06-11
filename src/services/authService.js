const { signToken } = require('../utils/jwt');
const { comparePassword } = require('../utils/hash');
const { getEmployeeByUsername } = require('../models/usersModel');

async function authenticateUser(username, password) {
  const user = await getEmployeeByUsername(username);

  if (!user) return null;

  const isPasswordMatch = await comparePassword(password, user.password);

  if (!isPasswordMatch) return null;

  const token = signToken({
    id: user.id,
    username: user.username,
    role: user.role,
  });

  return { token, role: user.role };
}

module.exports = {
  authenticateUser,
};
