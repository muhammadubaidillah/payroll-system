const { querySingle } = require('../libs/pgsql');

function getEmployeeByUsername(username) {
  return querySingle(`SELECT * FROM users where username = $1`, [username]);
}

module.exports = {
  getEmployeeByUsername,
};
