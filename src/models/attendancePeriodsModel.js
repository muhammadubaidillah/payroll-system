const { querySingle } = require('../../database/pgsql');

function isPeriodOverlap(startDate, endDate) {
  return querySingle(
    `SELECT 1 FROM attendance_periods 
    WHERE NOT (end_date < $1 OR start_date > $2)
    LIMIT 1`,
    [startDate, endDate]
  );
}

function insertPeriod({ id, start_date, end_date, created_by, ip_address }) {
  return querySingle(
    `INSERT INTO attendance_periods (id, start_date, end_date, created_by, ip_address)
    VALUES ($1, $2, $3, $4, $5) RETURNING id`,
    [id, start_date, end_date, created_by, ip_address]
  );
}

function getTodayAttendancePeriodId() {
  return querySingle(
    `SELECT id FROM attendance_periods WHERE CURRENT_DATE BETWEEN start_date AND end_date`
  );
}

module.exports = {
  isPeriodOverlap,
  insertPeriod,
  getTodayAttendancePeriodId,
};
