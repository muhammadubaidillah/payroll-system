const express = require('express');
const { validateAddPeriod } = require('../middlewares/validations/payrollValidation');
const { addPayrollPeriod } = require('../controllers/payrollController');
const { isAdmin } = require('../middlewares/roleMiddleware');

const router = express.Router();

router.post('/add-period', isAdmin, validateAddPeriod, addPayrollPeriod);

module.exports = router;
