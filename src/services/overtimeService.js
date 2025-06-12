const { v4: uuidv4 } = require('uuid');
const {
  isAfter,
  formatDate,
  now,
  isWeekend,
  isAfterHours,
  formats,
  isSameDay,
} = require('../utils/datetime');
const { insertOvertime } = require('../models/overtimeModel');
const { getTodayAttendancePeriodId } = require('../models/attendancePeriodsModel');

async function handleSubmitOvertime({ userId, startDatetime, endDatetime, ipAddress }) {
  const start = new Date(startDatetime);
  const end = new Date(endDatetime);

  if (isAfter(start, end)) {
    return {
      success: false,
      status: 400,
      message: `End time must be after start time`,
    };
  }

  if (isAfter(start, formatDate(now()))) {
    return {
      success: false,
      status: 400,
      message: `Cannot submit overtime for the future`,
    };
  }

  const durationMinutes = Math.floor((end - start) / (1000 * 60));
  if (durationMinutes <= 0 || durationMinutes > 180) {
    return {
      success: false,
      status: 400,
      message: `Overtime must be between 1 and 180 minutes`,
    };
  }

  if (!isWeekend(start) && !isAfterHours(start)) {
    return {
      success: false,
      status: 400,
      message: `Overtime can only be submitted after 17:00 on weekdays`,
    };
  }

  if (!isSameDay(start, end)) {
    return {
      success: false,
      status: 400,
      message: `Overtime can only be submitted on the same day`,
    };
  }

  const period = await getTodayAttendancePeriodId();

  const result = await insertOvertime({
    id: uuidv4(),
    userId,
    date: formatDate(start, formats.FMT_DATE_TIME_YMD),
    startTime: formatDate(start, formats.FMT_DATE_TIME_HM),
    endTime: formatDate(end, formats.FMT_DATE_TIME_HM),
    durationMinutes,
    ipAddress,
    periodId: period.id,
  });

  if (typeof result === 'object') {
    return {
      success: true,
      status: 200,
      message: `Overtime submitted`,
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
  handleSubmitOvertime,
};
