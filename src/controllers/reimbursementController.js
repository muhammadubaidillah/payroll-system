const { handleSubmitReimbursement } = require('../services/reimbursementService');
const { getClientIp } = require('../utils');
const logger = require('../utils/logger');

async function submitReimbursement(req, res) {
  try {
    const ipAddress = getClientIp(req);
    const { amount, description } = req.body;

    const result = await handleSubmitReimbursement({
      userId: req.user.id,
      amount,
      description,
      ipAddress,
    });

    if (result.success) {
      return res.status(201).json({ message: 'Reimbursement submitted' });
    } else {
      return res.status(400).json({ error: result.error });
    }
  } catch (error) {
    logger.error(error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

module.exports = {
  submitReimbursement,
};
