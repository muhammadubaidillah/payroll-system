const { handleSubmitOvertime } = require('../services/overtimeService');
const { getClientIp } = require('../utils');
const logger = require('../utils/logger');

async function submitOvertime(req, res, next) {
  const { response, clientIp, user } = res.locals;
  try {
    const { start_datetime: startDatetime, end_datetime: endDatetime } = req.body;

    const result = await handleSubmitOvertime({
      userId: user.id,
      startDatetime,
      endDatetime,
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
  submitOvertime,
};
