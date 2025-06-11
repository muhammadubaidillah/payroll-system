const { v4: uuidv4 } = require('uuid');
const { isPeriodOverlap, insertPeriod } = require('../models/attendancePeriodsModel');

async function isOverlap(startDate, endDate) {
  return await isPeriodOverlap(startDate, endDate);
}

async function createPeriod({ start_date, end_date, created_by, created_ip }) {
  return await insertPeriod({ id: uuidv4(), start_date, end_date, created_by, created_ip });
}

module.exports = {
  isOverlap,
  createPeriod,
};
