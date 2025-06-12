const joi = require('joi');
const logger = require('../utils/logger');

function doValidate(req, res, next, config, customObject) {
  const schema = joi.object(config);

  const useBody = ['POST', 'PUT', 'PATCH', 'DELETE'].includes(req.method.toUpperCase());

  const dataFromRequest = useBody ? req.body : req.query;

  const dataToValidate = {
    ...(typeof customObject === 'object' ? customObject : dataFromRequest),
    ...(req.files?.fileraw && { fileraw: req.files.fileraw }),
  };

  const { error } = schema.validate(dataToValidate, { allowUnknown: true });

  if (error) {
    return res.send({
      success: false,
      message: error.details?.[0]?.message || 'Validation error',
    });
  }

  next();
}

module.exports = {
  doValidate,
};
