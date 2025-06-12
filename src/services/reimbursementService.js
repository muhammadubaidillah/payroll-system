const { v4: uuidv4 } = require('uuid');
const { insertReimbursement } = require('../models/reimbursementsModel');
const { getTodayAttendancePeriodId } = require('../models/attendancePeriodsModel');

async function handleSubmitReimbursement({ userId, amount, description, ipAddress }) {
  const period = await getTodayAttendancePeriodId();

  const result = await insertReimbursement({
    id: uuidv4(),
    userId,
    amount,
    description,
    ipAddress,
    periodId: period.id,
  });

  if (typeof result === 'object') {
    return {
      success: true,
      status: 200,
      message: `Reimbursement submitted`,
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
  handleSubmitReimbursement,
};
