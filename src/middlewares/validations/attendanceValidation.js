const joi = require('joi');
const { doValidate } = require('../validatorMiddleware');

function validateAttendance(req, res, next) {
  doValidate(req, res, next, {
    attendace_datetime: joi.date().required(),
  });
}

module.exports = {
  validateAttendance,
};
