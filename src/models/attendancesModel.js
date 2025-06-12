const { querySingle } = require('../../database/pgsql');

function getTodayCheckIn(userId) {
  return querySingle(
    `SELECT id FROM attendances 
    WHERE user_id = $1 and date = CURRENT_DATE and check_in IS NOT NULL;
    `,
    [userId]
  );
}

function getTodayCheckOut(userId) {
  return querySingle(
    `SELECT id FROM attendances 
      WHERE user_id = $1 and date = CURRENT_DATE and check_out IS NOT NULL;
    `,
    [userId]
  );
}

function checkInAttendance({ id, userId, periodId, ipAddress }) {
  return querySingle(
    `
    INSERT INTO attendances (
      id, user_id, date, period_id,
      created_at, updated_at,
      created_by, updated_by, ip_address,
      check_in
    ) VALUES (
      $1, $2, CURRENT_DATE, $3,
      CURRENT_TIMESTAMP, CURRENT_TIMESTAMP,
      $2, $2, $4, CURRENT_TIMESTAMP
    ) RETURNING id`,
    [id, userId, periodId || null, ipAddress]
  );
}

function checkOutAttendance(userId) {
  return querySingle(
    `UPDATE attendances 
      SET 
        check_out = CURRENT_TIMESTAMP,
        updated_at = CURRENT_TIMESTAMP,
        updated_by = $1
      WHERE user_id = $1 
        AND date = CURRENT_DATE 
        AND check_in IS NOT NULL 
        AND check_out IS NULL
      RETURNING id`,
    [userId]
  );
}

function getTotalAttendancePerPeriod(periodId, userId) {
  return querySingle(
    `SELECT COUNT(*) as total_attendaces FROM attendances WHERE period_id = $1 AND user_id = $2`,
    [periodId, userId]
  );
}

module.exports = {
  getTodayCheckIn,
  getTodayCheckOut,
  checkInAttendance,
  checkOutAttendance,
  getTotalAttendancePerPeriod,
};
