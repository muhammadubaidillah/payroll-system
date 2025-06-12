const express = require('express');
const {
  validateAddPeriod,
  validateRunPayroll,
} = require('../middlewares/validations/payrollValidation');
const { addPayrollPeriod, runPayroll } = require('../controllers/payrollController');
const { isAdmin } = require('../middlewares/roleMiddleware');

const router = express.Router();

router.post('/add-period', isAdmin, validateAddPeriod, addPayrollPeriod);

router.post('/run-payroll', isAdmin, validateRunPayroll, runPayroll);

module.exports = router;
