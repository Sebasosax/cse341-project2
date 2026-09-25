const { validationResult } = require('express-validator');

// Returns 400 with all validation errors, otherwise continues
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (errors.isEmpty()) {
    return next();
  }
  return res.status(400).json({
    message: 'Validation failed',
    errors: errors.array().map((err) => ({
      field: err.path,
      message: err.msg
    }))
  });
};

module.exports = { validate };