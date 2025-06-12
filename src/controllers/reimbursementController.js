const { handleSubmitReimbursement } = require('../services/reimbursementService');
const { getClientIp } = require('../utils');
const logger = require('../utils/logger');

async function submitReimbursement(req, res, next) {
  const { response, clientIp, user } = res.locals;
  try {
    const { amount, description } = req.body;

    const result = await handleSubmitReimbursement({
      userId: user.id,
      amount,
      description,
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

module.exports = {
  submitReimbursement,
};
