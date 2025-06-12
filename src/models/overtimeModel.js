const { querySingle } = require('../../database/pgsql');

function insertOvertime({
  id,
  userId,
  date,
  startTime,
  endTime,
  durationMinutes,
  ipAddress,
  periodId,
}) {
  return querySingle(
    `INSERT INTO overtimes (
      id, user_id, date, start_time, end_time, duration_minutes,
      created_by, updated_by, ip_address, period_id
    ) VALUES ($1, $2, $3, $4, $5, $6, $2, $2, $7, $8)
     RETURNING id`,
    [id, userId, date, startTime, endTime, durationMinutes, ipAddress, periodId]
  );
}

function getMonthlyTotalOvertimeByUser(periodId, userId) {
  return querySingle(
    `SELECT COALESCE(SUM(duration_minutes), 0) AS total_overtime FROM overtimes
         WHERE period_id = $1 AND user_id = $2`,
    [periodId, userId]
  );
}

module.exports = {
  insertOvertime,
  getMonthlyTotalOvertimeByUser,
};
