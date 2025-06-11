const { isWeekend, now, formats } = require('../utils/datetime');
const {
  getTodayCheckIn,
  getTodayCheckOut,
  checkInAttendance,
  checkOutAttendance,
} = require('../models/attendancesModel');
const { getTodayAttendancePeriodId } = require('../models/attendancePeriodsModel');
const { v4: uuidv4 } = require('uuid');

async function submitAttendance(userId, ipAddress, isCheckIn) {
  if (isWeekend(now(formats.FMT_DATE_TIME_YMDHMS))) {
    return { success: false, error: 'Attendance not allowed on weekends' };
  }

  const existing = isCheckIn ? await getTodayCheckIn(userId) : await getTodayCheckOut(userId);

  if (existing) {
    return {
      success: false,
      error: ` ${isCheckIn ? 'Check-in' : 'Check-out'} attendance already submitted today`,
    };
  }

  const period = await getTodayAttendancePeriodId();

  isCheckIn
    ? await checkInAttendance({ id: uuidv4(), userId, periodId: period.id, ipAddress })
    : await checkOutAttendance(userId);

  return { success: true };
}

module.exports = {
  submitAttendance,
};
