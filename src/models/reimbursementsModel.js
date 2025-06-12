const { querySingle } = require('../../database/pgsql');

function insertReimbursement({ id, userId, amount, description, ipAddress, periodId }) {
  return querySingle(
    `INSERT INTO reimbursements (
      id, user_id, amount, description,
      created_at, created_by, ip_address, period_id
    ) VALUES ($1, $2, $3, $4, NOW(), $2, $5, $6)
     RETURNING id`,
    [id, userId, amount, description || null, ipAddress, periodId]
  );
}

function getMonthlyTotalReimbursementByUser(periodId, userId) {
  return querySingle(
    `SELECT COALESCE(SUM(amount), 0) AS total_reimbursement FROM reimbursements
         WHERE period_id = $1 AND user_id = $2`,
    [periodId, userId]
  );
}

module.exports = {
  insertReimbursement,
  getMonthlyTotalReimbursementByUser,
};
