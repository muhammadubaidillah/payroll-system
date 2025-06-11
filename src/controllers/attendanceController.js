const { submitAttendance } = require('../services/attendanceService');
const { getClientIp } = require('../utils');

async function checkIn(req, res) {
  try {
    const ipAddress = getClientIp(req);

    const result = await submitAttendance(req.user.id, ipAddress, true);

    if (result.success) {
      return res.status(201).json({ message: 'Attendance submitted' });
    } else {
      return res.status(400).json({ error: result.error });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Server error' });
  }
}

async function checkOut(req, res) {
  try {
    const ipAddress = getClientIp(req);

    const result = await submitAttendance(req.user.id, ipAddress, false);

    if (result.success) {
      return res.status(201).json({ message: 'Attendance submitted' });
    } else {
      return res.status(400).json({ error: result.error });
    }
  } catch (error) {
    console.error(err);
    return res.status(500).json({ error: 'Server error' });
  }
}

module.exports = {
  checkIn,
  checkOut,
};
