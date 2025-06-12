const { querySingle } = require('../../database/pgsql');

function isPeriodOverlap(startDate, endDate) {
  return querySingle(
    `SELECT 1 FROM attendance_periods 
    WHERE NOT (end_date < $1 OR start_date > $2)
    LIMIT 1`,
    [startDate, endDate]
  );
}

function insertPeriod({ id, startDate, endDate, userId, totalDays, ipAddress }) {
  return querySingle(
    `INSERT INTO attendance_periods (id, start_date, end_date, total_working_days, created_by, ip_address)
    VALUES ($1, $2, $3, $4, $5, $6) RETURNING id`,
    [id, startDate, endDate, totalDays, userId, ipAddress]
  );
}

function getTodayAttendancePeriodId() {
  return querySingle(
    `SELECT id FROM attendance_periods WHERE CURRENT_DATE BETWEEN start_date AND end_date`
  );
}

function getTotalWorkingDays(periodId) {
  return querySingle(`SELECT total_working_days FROM attendance_periods WHERE id = $1`, [periodId]);
}

module.exports = {
  isPeriodOverlap,
  insertPeriod,
  getTodayAttendancePeriodId,
  getTotalWorkingDays,
};
