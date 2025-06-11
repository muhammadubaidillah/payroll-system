const { v4: uuidv4 } = require('uuid');
const { insertReimbursement } = require('../models/reimbursementsModel');

async function handleSubmitReimbursement({ userId, amount, description, ipAddress }) {
  await insertReimbursement({
    id: uuidv4(),
    userId,
    amount,
    description,
    ipAddress,
  });

  return { success: true };
}

module.exports = {
  handleSubmitReimbursement,
};
