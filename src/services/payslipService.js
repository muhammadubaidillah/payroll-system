const { getAttendancePeriodByDate } = require('../models/attendancePeriodsModel');
const {
  getPayrollDetailByUserAndPayrollId,
  getPayrollDetailByPayrollId,
} = require('../models/payrollDetailModel');
const { getPayrollByPeriodId } = require('../models/payrollModel');
const logger = require('../utils/logger');
const { generatePayslipPdf, generatePayslipSummaryPdf } = require('../utils/pdf');

function extractPayslipSummaryData(payrollDetails) {
  const initialState = {
    summary: [],
    total_take_home_pay: 0,
  };

  const result = payrollDetails.reduce((accumulator, item, index) => {
    const pay = parseFloat(item.take_home_pay);

    accumulator.summary.push({
      name: item.full_name,
      take_home_pay: pay,
    });

    accumulator.total_take_home_pay += pay;

    return accumulator;
  }, initialState);

  return result;
}

async function handleGeneratePayslip(userId, payslipDate) {
  const period = await getAttendancePeriodByDate(payslipDate);

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

  const payrollDetail = await getPayrollDetailByUserAndPayrollId(userId, payroll.id);

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
    message: `Payslip generated`,
    data: {
      pdfBuffer,
    },
  };
}

async function handleGeneratePayslipSummary(payslipDate) {
  const period = await getAttendancePeriodByDate(payslipDate);

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

  const payrollDetail = await getPayrollDetailByPayrollId(payroll.id);

  if (payrollDetail.length === 0) {
    return {
      success: false,
      status: 404,
      message: `Payslip not found`,
    };
  }

  const { summary, total_take_home_pay: totalTakeHomePay } =
    extractPayslipSummaryData(payrollDetail);

  const pdfBuffer = await generatePayslipSummaryPdf({
    periodId: period.id,
    summary,
    totalTakeHomePay,
  });

  logger.info(`pdfBuffer ${pdfBuffer}`);

  return {
    success: true,
    status: 200,
    message: `Payslip summary generated`,
    data: {
      pdfBuffer,
    },
  };
}

module.exports = {
  handleGeneratePayslip,
  handleGeneratePayslipSummary,
};
