const {
  handleGeneratePayslip,
  handleGeneratePayslipSummary,
} = require('../services/payslipService');
const { formatDate, formats } = require('../utils/datetime');
const logger = require('../utils/logger');

async function generatePayslip(req, res, next) {
  const { response, user } = res.locals;
  try {
    const { period_date: periodDate } = req.query;

    const result = await handleGeneratePayslip(
      user.id,
      formatDate(new Date(periodDate), formats.FMT_DATE_TIME_YMDHMS)
    );
    if (typeof result === 'object') {
      if (result.success) {
        res.set({
          'Content-Type': 'application/pdf',
          'Content-Disposition': `attachment; filename="Payslip_${formatDate(new Date(periodDate), formats.FMT_DATE_TIME_YMDHMS)}.pdf"`,
          'Content-Length': result.data.pdfBuffer.length,
        });
        res.send(result.data.pdfBuffer);
      } else {
        response.status = result.status;
        response.success = result.success;
        response.message = result.message;

        next();
      }
    } else {
      response.status = 500;
      response.success = false;
      response.message = 'Internal Server Error';

      next();
    }
  } catch (error) {
    logger.error(error);
    response.status = 500;
    response.success = false;
    response.message = 'Internal Server Error';
    next();
  }
}

async function generatePayslipSummary(req, res, next) {
  const { response } = res.locals;
  try {
    const { period_date: periodDate } = req.query;

    const result = await handleGeneratePayslipSummary(
      formatDate(new Date(periodDate), formats.FMT_DATE_TIME_YMDHMS)
    );

    if (typeof result === 'object') {
      if (result.success) {
        res.set({
          'Content-Type': 'application/pdf',
          'Content-Disposition': `attachment; filename="Payslip_${formatDate(new Date(periodDate), formats.FMT_DATE_TIME_YMDHMS)}.pdf"`,
          'Content-Length': result.data.pdfBuffer.length,
        });
        res.send(result.data.pdfBuffer);
      } else {
        response.status = result.status;
        response.success = result.success;
        response.message = result.message;

        next();
      }
    } else {
      response.status = 500;
      response.success = false;
      response.message = 'Internal Server Error';

      next();
    }
  } catch (error) {
    response.status = 500;
    response.success = false;
    response.message = 'Internal Server Error';
    next();
  }
}

module.exports = {
  generatePayslip,
  generatePayslipSummary,
};
