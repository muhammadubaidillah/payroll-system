const { response } = require('express');
const { handleAddPeriod, handleRunPayroll } = require('../services/payrollService');
const { getClientIp } = require('../utils');
const logger = require('../utils/logger');

async function addPayrollPeriod(req, res, next) {
  const { response, clientIp, user } = res.locals;
  try {
    const { start_date: startDate, end_date: endDate } = req.body;

    const result = await handleAddPeriod({
      userId: user.id,
      startDate,
      endDate,
      ipAddress: clientIp,
    });

    response.status = result.status;
    response.success = result.success;
    response.message = result.message;
  } catch (error) {
    logger.error(error);
    response.status = 500;
    response.success = false;
    response.message = 'Internal Server Error';
  }

  next();
}

async function runPayroll(req, res, next) {
  try {
    const { response, clientIp, user } = res.locals;
    const { period_id: periodId } = req.body;
    logger.info(`periodId: ${periodId} user: ${JSON.stringify(user)} clientIp: ${clientIp}`);

    const result = await handleRunPayroll({
      periodId,
      userId: user.id,
      ipAddress: clientIp,
    });

    response.status = result.status;
    response.success = result.success;
    response.message = result.message;
  } catch (error) {
    response.status = 500;
    response.success = false;
    response.message = 'Internal Server Error';
  }

  next();
}

module.exports = {
  addPayrollPeriod,
  runPayroll,
};
