const { querySingle, queryList } = require('../../database/pgsql');

function getPayrollDetailByUserAndPayrollId(userId, payrollId) {
  return querySingle(`SELECT * FROM payroll_details WHERE user_id = $1 AND payroll_id = $2`, [
    userId,
    payrollId,
  ]);
}

function getPayrollDetailByPayrollId(payrollId) {
  return queryList(
    `SELECT pd.*, u.full_name FROM payroll_details pd 
    LEFT JOIN users u ON u.id = pd.user_id 
    WHERE pd.payroll_id = $1`,
    [payrollId]
  );
}

function insertPayrollDetail({
  id,
  payrollId,
  userId,
  baseSalary,
  totalAttendanceDays,
  proratedSalary,
  overtimeMinutes,
  overtimePay,
  reimbursementTotal,
  takeHomePay,
}) {
  return querySingle(
    `INSERT INTO payroll_details (
        id, payroll_id, user_id, base_salary, total_attendance_days,
        prorated_salary, overtime_minutes, overtime_pay, reimbursement_total, take_home_pay
    ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)
     RETURNING id`,
    [
      id,
      payrollId,
      userId,
      baseSalary,
      totalAttendanceDays,
      proratedSalary,
      overtimeMinutes,
      overtimePay,
      reimbursementTotal,
      takeHomePay,
    ]
  );
}

module.exports = {
  insertPayrollDetail,
  getPayrollDetailByUserAndPayrollId,
  getPayrollDetailByPayrollId,
};
