const express = require('express');
const { checkIn, checkOut } = require('../controllers/attendanceController');
const { isEmployee } = require('../middlewares/roleMiddleware');

const router = express.Router();

router.post('/check-in', isEmployee, checkIn);

router.post('/check-out', isEmployee, checkOut);

module.exports = router;
