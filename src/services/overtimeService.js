const { v4: uuidv4 } = require('uuid');
const {
  createFromTime,
  isAfter,
  formatDate,
  now,
  isWeekend,
  isAfterHours,
  formats,
  instance,
  isSameDay,
} = require('../utils/datetime');
const { insertOvertime } = require('../models/overtimeModel');
const logger = require('../utils/logger');

async function handleSubmit({ userId, startTime, endTime, ipAddress }) {
  const start = new Date(startTime);
  const end = new Date(endTime);

  if (isAfter(start, end)) {
    return {
      success: false,
      status: 400,
      error: `End time must be after start time`,
    };
  }

  if (isAfter(start, formatDate(now()))) {
    return {
      success: false,
      status: 400,
      error: `Cannot submit overtime for the future`,
    };
  }

  const durationMinutes = Math.floor((end - start) / (1000 * 60));
  if (durationMinutes <= 0 || durationMinutes > 180) {
    return {
      success: false,
      error: `Overtime must be between 1 and 180 minutes`,
    };
  }

  if (!isWeekend(start) && !isAfterHours(start)) {
    return {
      success: false,
      error: `Overtime can only be submitted after 17:00 on weekdays`,
    };
  }

  if (!isSameDay(start, end)) {
    return {
      success: false,
      error: `Overtime can only be submitted on the same day`,
    };
  }

  await insertOvertime({
    id: uuidv4(),
    userId,
    date: formatDate(start, formats.FMT_DATE_TIME_YMD),
    startTime: formatDate(start, formats.FMT_DATE_TIME_HM),
    endTime: formatDate(end, formats.FMT_DATE_TIME_HM),
    durationMinutes,
    ipAddress,
  });

  return { success: true };
}

module.exports = {
  handleSubmit,
};
