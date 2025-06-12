const express = require('express');

const { validateGeneratePayslip } = require('../middlewares/validations/payslipValidation');
const { generatePayslip, generatePayslipSummary } = require('../controllers/payslipController');

const { isEmployee, isAdmin } = require('../middlewares/roleMiddleware');

const router = express.Router();

router.get('/generate', isEmployee, validateGeneratePayslip, generatePayslip);

router.get('/generate-summary', isAdmin, validateGeneratePayslip, generatePayslipSummary);

module.exports = router;
