const { v4: uuidv4 } = require('uuid');
const {
  isPeriodOverlap,
  insertPeriod,
  getTotalWorkingDays,
} = require('../models/attendancePeriodsModel');
const { getPayrollByPeriodId, insertPayroll } = require('../models/payrollModel');
const { getUsersByRole } = require('../models/usersModel');
const { formatDate, isAfter, countWorkingDays } = require('../utils/datetime');
const { query } = require('../../database/pgsql');
const { getTotalAttendancePerPeriod } = require('../models/attendancesModel');
const { getMonthlyTotalOvertimeByUser } = require('../models/overtimeModel');
const { getMonthlyTotalReimbursementByUser } = require('../models/reimbursementsModel');
const { insertPayrollDetail } = require('../models/payrollDetailModel');

async function handleAddPeriod({ userId, startDate, endDate, ipAddress }) {
  if (isAfter(formatDate(startDate), formatDate(endDate))) {
    return {
      success: false,
      status: 400,
      message: `End date must be after start date`,
    };
  }

  const existing = await isPeriodOverlap(startDate, endDate);
  if (typeof existing === 'object') {
    return {
      success: false,
      status: 400,
      message: `Payroll period overlaps with existing period`,
    };
  }

  const result = await insertPeriod({
    id: uuidv4(),
    startDate,
    endDate,
    userId,
    totalDays: countWorkingDays(startDate, endDate),
    ipAddress,
  });

  if (typeof result === 'object') {
    return {
      success: true,
      status: 200,
      message: `Payroll period added successfully`,
    };
  } else {
    return {
      success: false,
      status: 500,
      message: `Internal Server Error`,
    };
  }
}

async function handleRunPayroll({ periodId, userId, ipAddress }) {
  try {
    await query(`BEGIN`);

    const existingPayroll = await getPayrollByPeriodId(periodId);
    if (typeof existingPayroll === 'object') {
      return {
        success: false,
        status: 400,
        message: `Payroll already processed for this period`,
      };
    }
    const payroll = await insertPayroll({
      id: uuidv4(),
      periodId,
      userId,
      ipAddress,
    });

    if (typeof payroll !== 'object') {
      return {
        success: false,
        status: 500,
        message: `Failed to insert payroll, please try again later`,
      };
    }

    const userRes = await getUsersByRole('employee');

    for (const user of userRes) {
      const { id: userId, salary: userSalary } = user;

      const attendances = await getTotalAttendancePerPeriod(periodId, userId);
      const totalAttendanceDays =
        typeof attendances === 'object' ? parseInt(attendances.total_attendaces) : 0;

      const attendancePeriod = await getTotalWorkingDays(periodId);
      const totalWorkingDays =
        typeof attendancePeriod === 'object' ? parseInt(attendancePeriod.total_working_days) : 0;

      const overtimes = await getMonthlyTotalOvertimeByUser(periodId, userId);
      const totalOvertimeMinutes =
        typeof overtimes === 'object' ? parseInt(overtimes.total_overtime) : 0;

      const reimbursement = await getMonthlyTotalReimbursementByUser(periodId, userId);
      const totalReimbursement =
        typeof reimbursement === 'object' ? parseFloat(reimbursement.total_reimbursement) : 0;

      const proratedSalary = (totalAttendanceDays / totalWorkingDays) * userSalary;
      const overtimePay = (userSalary / totalAttendanceDays / 8) * 2 * (totalOvertimeMinutes / 60);

      const takeHomePay = proratedSalary + overtimePay + totalReimbursement;

      const payrollDetailData = {
        id: uuidv4(),
        payrollId: payroll.id,
        userId,
        baseSalary: userSalary,
        totalAttendanceDays,
        proratedSalary: proratedSalary || 0,
        overtimeMinutes: totalOvertimeMinutes,
        overtimePay: overtimePay || 0,
        reimbursementTotal: totalReimbursement,
        takeHomePay: takeHomePay || 0,
      };
      await insertPayrollDetail(payrollDetailData);
    }

    await query(`COMMIT`);
    return {
      success: true,
      status: 200,
      message: `Success running payroll`,
    };
  } catch (error) {
    await query('ROLLBACK');
    return {
      success: false,
      status: 500,
      message: `Internal Server Error`,
    };
  }
}

module.exports = {
  handleAddPeriod,
  handleRunPayroll,
};
