const bcrypt = require('bcryptjs');
const config = require('../../config');

async function hashPassword(plainPassword) {
  return await bcrypt.hashSync(plainPassword, config.salt.rounds);
}

async function comparePassword(plainPassword, hashedPassword) {
  return await bcrypt.compareSync(plainPassword, hashedPassword);
}

module.exports = {
  hashPassword,
  comparePassword,
};
