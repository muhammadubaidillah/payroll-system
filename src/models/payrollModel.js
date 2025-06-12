const { querySingle } = require('../../database/pgsql');

function getPayrollByPeriodId(periodId) {
  return querySingle(`SELECT id FROM payrolls WHERE period_id = $1`, [periodId]);
}

function insertPayroll({ id, periodId, userId, ipAddress }) {
  return querySingle(
    `INSERT INTO payrolls (
      id, period_id, processed_by, ip_address,
      created_by, updated_by
    ) VALUES ($1, $2, $3, $4, $3, $3)
     RETURNING id
  `,
    [id, periodId, userId, ipAddress]
  );
}

module.exports = {
  getPayrollByPeriodId,
  insertPayroll,
};
