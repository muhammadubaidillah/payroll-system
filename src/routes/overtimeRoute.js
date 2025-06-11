const express = require('express');
const { validateSubmitOvertime } = require('../middlewares/validations/overtimeValidation');
const { submitOvertime } = require('../controllers/overtimeController');
const { isEmployee } = require('../middlewares/roleMiddleware');

const router = express.Router();

router.post('/submit', isEmployee, validateSubmitOvertime, submitOvertime);

module.exports = router;
