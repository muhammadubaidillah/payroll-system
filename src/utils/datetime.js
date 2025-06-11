const moment = require('moment');
require('moment/locale/id');

moment.locale('id');

const formats = {
  FMT_DATE_TIME_Y: 'YYYY',
  FMT_DATE_TIME_YM: 'YYYY-MM',
  FMT_DATE_TIME_YMD: 'YYYY-MM-DD',
  FMT_DATE_TIME_DMY_DOT: 'DD.MM.YYYY',
  FMT_DATE_TIME_YMDHM: 'YYYY-MM-DD HH:mm',
  FMT_DATE_TIME_YMDHMS: 'YYYY-MM-DD HH:mm:ss',
  FMT_DATE_TIME_YMDHMSX: 'YYYYMMDDHHmmss',
  FMT_DATE_TIME_YMDHMSU: 'YYYY-MM-DD HH:mm:ss.SSS',
  FMT_DATE_TIME_YMDTZHMS: `YYYY-MM-DDTHH:mm:ssZ`,
  FMT_DATE_TIME_YMDTZHMSU: `YYYY-MM-DD'T'HH:mm:ssZ`,
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

module.exports = {
  now,
  yesterday,
  instance,
  parse,
  formats,
  formatDate,
  isAfter,
};
