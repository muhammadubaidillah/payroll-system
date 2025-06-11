const joi = require('joi');
const { doValidate } = require('../validatorMiddleware');

function validateSubmitOvertime(req, res, next) {
  doValidate(req, res, next, {
    start_datetime: joi.date().required(),
    end_datetime: joi.date().required(),
  });
}

module.exports = {
  validateSubmitOvertime,
};
