const { querySingle, queryList } = require('../../database/pgsql');

function getEmployeeByUsername(username) {
  return querySingle(`SELECT * FROM users where username = $1`, [username]);
}

function getUsersByRole(role) {
  return queryList(`SELECT id, role, salary FROM users WHERE role = $1`, [role]);
}

module.exports = {
  getEmployeeByUsername,
  getUsersByRole,
};
