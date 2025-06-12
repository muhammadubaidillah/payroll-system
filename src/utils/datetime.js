const moment = require('moment');
require('moment/locale/id');

moment.locale('id');

const formats = {
  FMT_DATE_TIME_Y: 'YYYY',
  FMT_DATE_TIME_YM: 'YYYY-MM',
  FMT_DATE_TIME_YMD: 'YYYY-MM-DD',
  FMT_DATE_TIME_DMY_DOT: 'DD.MM.YYYY',
  FMT_DATE_TIME_DMY: 'DD MM YYYY',
  FMT_DATE_TIME_YMDHM: 'YYYY-MM-DD HH:mm',
  FMT_DATE_TIME_YMDHMS: 'YYYY-MM-DD HH:mm:ss',
  FMT_DATE_TIME_YMDHMSX: 'YYYYMMDDHHmmss',
  FMT_DATE_TIME_YMDHMSU: 'YYYY-MM-DD HH:mm:ss.SSS',
  FMT_DATE_TIME_YMDTZHMS: `YYYY-MM-DDTHH:mm:ssZ`,
  FMT_DATE_TIME_YMDTZHMSU: `YYYY-MM-DD'T'HH:mm:ssZ`,
  FMT_DATE_TIME_HM: `HH:mm`,
};

function yesterday(format) {
  return moment()
    .subtract(1, 'day')
    .format(format || formats.FMT_DATE_TIME_YMDHMSU);
}

function now(format) {
  return moment().format(format || formats.FMT_DATE_TIME_YMDHMSU);
}

function instance(date) {
  return moment(date);
}

function parse(date, format) {
  return moment(date, format);
}

function formatDate(date, format) {
  return moment(date).format(format || formats.FMT_DATE_TIME_YMDHMS);
}

function isAfter(date, comparedDate) {
  return moment(date).isAfter(comparedDate);
}

function isWeekend(date) {
  return moment(date).isoWeekday() > 5;
}

function isAfterHours(date) {
  const afterHoursStart = moment(date).clone().hour(17).minute(0).second(0).millisecond(0);
  return moment(date).isSameOrAfter(afterHoursStart);
}

function isSameDay(date, comparedDate) {
  return moment(date).isSame(moment(comparedDate), 'day');
}

function isToday(date) {
  return moment(date).isSame(moment(), 'day');
}

function countWorkingDays(startDate, endDate) {
  let current = moment(startDate);
  const end = moment(endDate);
  let workingDays = 0;

  for (; current.isSameOrBefore(end, 'day'); current.add(1, 'day')) {
    if (current.isoWeekday() <= 5) workingDays++; // 1 = Monday, 7 = Sunday
  }

  return workingDays;
}

module.exports = {
  now,
  yesterday,
  instance,
  parse,
  formats,
  formatDate,
  isAfter,
  isWeekend,
  isAfterHours,
  isSameDay,
  countWorkingDays,
  isToday,
};
