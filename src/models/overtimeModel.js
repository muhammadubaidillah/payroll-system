const { query } = require('../../database/pgsql');

function insertOvertime({ id, userId, date, startTime, endTime, durationMinutes, ipAddress }) {
  return query(
    `INSERT INTO overtimes (
      id, user_id, date, start_time, end_time, duration_minutes,
      created_by, updated_by, ip_address
    ) VALUES ($1, $2, $3, $4, $5, $6, $2, $2, $7)`,
    [id, userId, date, startTime, endTime, durationMinutes, ipAddress]
  );
}

module.exports = {
  insertOvertime,
};
