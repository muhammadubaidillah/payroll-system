const bcrypt = require('bcryptjs');
const config = require('../../config');

function hashPassword(plainPassword) {
  return bcrypt.hashSync(plainPassword, config.salt.rounds);
}

function comparePassword(plainPassword, hashedPassword) {
  return bcrypt.compareSync(plainPassword, hashedPassword);
}

module.exports = {
  hashPassword,
  comparePassword,
};
