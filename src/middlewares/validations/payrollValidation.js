const joi = require('joi');
const { doValidate } = require('../validatorMiddleware');

function validateAddPeriod(req, res, next) {
  doValidate(req, res, next, {
    start_date: joi.date().required(),
    end_date: joi.date().required(),
  });
}

function validateRunPayroll(req, res, next) {
  doValidate(req, res, next, {
    period_id: joi.string().required(),
  });
}

module.exports = {
  validateAddPeriod,
  validateRunPayroll,
};
