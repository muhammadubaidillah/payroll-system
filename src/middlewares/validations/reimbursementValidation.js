const joi = require('joi');
const { doValidate } = require('../validatorMiddleware');

function validateSubmitReimbursement(req, res, next) {
  doValidate(req, res, next, {
    amount: joi.number().positive().required(),
    description: joi.string().max(500).optional(),
  });
}

module.exports = {
  validateSubmitReimbursement,
};
