const express = require('express');
const { getEmployeeByUsername } = require('../models/usersModel');
const { tokenVerification } = require('../middlewares/authMiddleware');
const logger = require('../utils/logger');

const router = express.Router();

router.get('/employee', tokenVerification, async (req, res) => {
  try {
    const username = req.query.username;
    const employee = await getEmployeeByUsername(username);

    if (!employee) {
      return res.status(404).json({ error: 'Employee not found' });
    }

    res.status(200).json(employee);
  } catch (error) {
    logger.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;
