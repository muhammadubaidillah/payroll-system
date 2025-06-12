const { submitAttendance } = require('../services/attendanceService');
const logger = require('../utils/logger');

async function checkIn(req, res, next) {
  const { response, clientIp, user } = res.locals;
  try {
    const { attendace_datetime: attendaceDatetime } = req.body;

    const result = await submitAttendance({
      userId: user.id,
      ipAddress: clientIp,
      isCheckIn: true,
      attendaceDatetime,
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

async function checkOut(req, res, next) {
  const { response, clientIp, user } = res.locals;
  try {
    const { attendace_datetime: attendaceDatetime } = req.body;

    const result = await submitAttendance({
      userId: user.id,
      ipAddress: clientIp,
      isCheckIn: false,
      attendaceDatetime,
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
  checkIn,
  checkOut,
};
