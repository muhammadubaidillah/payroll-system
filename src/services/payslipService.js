const { getTodayAttendancePeriodByDate } = require('../models/attendancePeriodsModel');
const { getPayrollDetailByUserAndPeriod } = require('../models/payrollDetailModel');
const { getPayrollByPeriodId } = require('../models/payrollModel');
const { generatePayslipPdf } = require('../utils/pdf');

async function handleGeneratePayslip(userId, payslipDate) {
  const period = await getTodayAttendancePeriodByDate(payslipDate);

  if (typeof period !== 'object') {
    return {
      success: false,
      status: 404,
      message: `Attendance period not found`,
    };
  }

  const payroll = await getPayrollByPeriodId(period.id);

  if (typeof payroll !== 'object') {
    return {
      success: false,
      status: 404,
      message: `Payroll not found`,
    };
  }

  const payrollDetail = await getPayrollDetailByUserAndPeriod(userId, payroll.id);

  if (typeof payrollDetail !== 'object') {
    return {
      success: false,
      status: 404,
      message: `Payslip not found`,
    };
  }

  const pdfBuffer = await generatePayslipPdf(payrollDetail);

  return {
    success: true,
    status: 200,
    message: `Payslip found`,
    data: {
      pdfBuffer,
    },
  };
}

module.exports = {
  handleGeneratePayslip,
};
