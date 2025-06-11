const { handleSubmit } = require('../services/overtimeService');
const { getClientIp } = require('../utils');
const logger = require('../utils/logger');

async function submitOvertime(req, res) {
  try {
    const ipAddress = getClientIp(req);
    const { start_datetime: startTime, end_datetime: endTime } = req.body;

    const result = await handleSubmit({ userId: req.user.id, startTime, endTime, ipAddress });

    if (result.success) {
      return res.status(201).json({ message: 'Overtime submitted' });
    } else {
      return res.status(400).json({ error: result.error });
    }
  } catch (error) {
    logger.error(error);
    return res.status(500).json({ error: 'Server error' });
  }
}

module.exports = {
  submitOvertime,
};
