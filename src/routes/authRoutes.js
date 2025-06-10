const express = require('express');
const { validateLogin } = require('../middlewares/validations/authValidation');
const { login } = require('../controllers/authController');

const router = express.Router();

router.post('/login', validateLogin, login);

module.exports = router;
