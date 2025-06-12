const express = require('express');

const { validateGeneratePayslip } = require('../middlewares/validations/payslipValidation');
const { generatePayslip } = require('../controllers/payslipController');

const { isEmployee } = require('../middlewares/roleMiddleware');

const router = express.Router();

router.get('/generate', isEmployee, validateGeneratePayslip, generatePayslip);

module.exports = router;
