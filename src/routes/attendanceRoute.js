const express = require('express');
const { checkIn, checkOut } = require('../controllers/attendanceController');
const { isEmployee } = require('../middlewares/roleMiddleware');
const { validateAttendance } = require('../middlewares/validations/attendanceValidation');

const router = express.Router();

router.post('/check-in', validateAttendance, isEmployee, checkIn);

router.post('/check-out', validateAttendance, isEmployee, checkOut);

module.exports = router;
