const { query } = require('../../database/pgsql');

function insertAuditLog({ id, path, payload, userId, ipAddress, requestId }) {
  return query(
    `INSERT INTO audit_logs (id, request_path, payload, user_id, ip_address, request_id)
    VALUES ($1, $2, $3, $4, $5, $6)
  `,
    [id, path, payload, userId, ipAddress, requestId]
  );
}

module.exports = {
  insertAuditLog,
};
