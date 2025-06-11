const express = require('express');
const {
  validateSubmitReimbursement,
} = require('../middlewares/validations/reimbursementValidation');
const { submitReimbursement } = require('../controllers/reimbursementController');
const { isEmployee } = require('../middlewares/roleMiddleware');

const router = express.Router();

router.post('/submit', isEmployee, validateSubmitReimbursement, submitReimbursement);

module.exports = router;
