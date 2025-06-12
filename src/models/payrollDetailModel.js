const { querySingle } = require('../../database/pgsql');

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
};
