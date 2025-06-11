const { querySingle } = require('../../database/pgsql');

function isPeriodOverlap(startDate, endDate) {
  return querySingle(
    `SELECT 1 FROM attendance_periods 
    WHERE NOT (end_date < $1 OR start_date > $2)
    LIMIT 1`,
    [startDate, endDate]
  );
}

function insertPeriod({ id, start_date, end_date, created_by, created_ip }) {
  return querySingle(
    `INSERT INTO attendance_periods (id, start_date, end_date, created_by, created_ip)
    VALUES ($1, $2, $3, $4, $5) RETURNING id`,
    [id, start_date, end_date, created_by, created_ip]
  );
}

module.exports = {
  isPeriodOverlap,
  insertPeriod,
};
