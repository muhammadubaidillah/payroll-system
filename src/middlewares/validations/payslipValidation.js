const joi = require('joi');
const { doValidate } = require('../validatorMiddleware');

function validateGeneratePayslip(req, res, next) {
  doValidate(req, res, next, {
    period_date: joi.date().required(),
  });
}

module.exports = {
  validateGeneratePayslip,
};
