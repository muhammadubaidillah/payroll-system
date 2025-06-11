const { query } = require('../../database/pgsql');

function insertReimbursement({ id, userId, amount, description, ipAddress }) {
  return query(
    `INSERT INTO reimbursements (
      id, user_id, amount, description,
      created_at, created_by, ip_address
    ) VALUES ($1, $2, $3, $4, NOW(), $2, $5)`,
    [id, userId, amount, description || null, ipAddress]
  );
}

module.exports = {
  insertReimbursement,
};
