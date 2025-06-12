const { isWeekend, now, formats, isToday, formatDate } = require('../utils/datetime');
const {
  getTodayCheckIn,
  getTodayCheckOut,
  checkInAttendance,
  checkOutAttendance,
} = require('../models/attendancesModel');
const { getTodayAttendancePeriodId } = require('../models/attendancePeriodsModel');
const { v4: uuidv4 } = require('uuid');

async function submitAttendance({ userId, ipAddress, isCheckIn, attendaceDatetime }) {
  if (!isToday(formatDate(attendaceDatetime))) {
    return {
      success: false,
      status: 400,
      message: `Date must be today. Attendance for past or future dates is not allowed.`,
    };
  }

  if (isWeekend(now(formats.FMT_DATE_TIME_YMDHMS))) {
    return {
      success: false,
      status: 400,
      message: `Attendance not allowed on weekends`,
    };
  }

  const existing = isCheckIn ? await getTodayCheckIn(userId) : await getTodayCheckOut(userId);

  if (existing) {
    return {
      success: false,
      status: 400,
      message: `${isCheckIn ? 'Check-in' : 'Check-out'} attendance already submitted today`,
    };
  }

  const period = await getTodayAttendancePeriodId();

  if (!isCheckIn) {
    const isCheckInDataExist = await getTodayCheckIn(userId);

    if (typeof isCheckInDataExist !== 'object') {
      return {
        success: false,
        status: 400,
        message: `Please submit check-in attendance first`,
      };
    }
  }

  const result = isCheckIn
    ? await checkInAttendance({ id: uuidv4(), userId, periodId: period.id, ipAddress })
    : await checkOutAttendance(userId);

  if (typeof result === 'object') {
    return {
      success: true,
      status: 200,
      message: `Attendance submitted successfully`,
    };
  } else {
    return {
      success: false,
      status: 500,
      message: `Internal Server Error`,
    };
  }
}

module.exports = {
  submitAttendance,
};
