const joi = require('joi');
const { doValidate } = require('../validatorMiddleware');

function validateLogin(req, res, next) {
  doValidate(req, res, next, {
    username: joi.string().min(3).max(30).required(),
    password: joi.string().min(8).max(30).required(),
  });
}

module.exports = {
  validateLogin,
};
