const joi = require('joi');
const { doValidate } = require('../validatorMiddleware');

function validateAddPeriod(req, res, next) {
  doValidate(req, res, next, {
    start_date: joi.date().required(),
    end_date: joi.date().required(),
  });
}

module.exports = {
  validateAddPeriod,
};
