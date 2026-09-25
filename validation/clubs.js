const { body, param } = require('express-validator');
const { validate } = require('./validate');

const currentYear = new Date().getFullYear();

// Rules for the club body (used by POST and PUT)
const clubRules = () => [
  body('name')
    .trim()
    .notEmpty().withMessage('name is required').bail()
    .isLength({ min: 2, max: 100 }).withMessage('name must be 2-100 characters'),

  body('city')
    .trim()
    .notEmpty().withMessage('city is required').bail()
    .isLength({ max: 100 }).withMessage('city must be at most 100 characters'),

  body('country')
    .trim()
    .notEmpty().withMessage('country is required').bail()
    .isLength({ max: 60 }).withMessage('country must be at most 60 characters'),

  body('league')
    .trim()
    .notEmpty().withMessage('league is required').bail()
    .isLength({ max: 100 }).withMessage('league must be at most 100 characters'),

  body('stadium')
    .trim()
    .notEmpty().withMessage('stadium is required').bail()
    .isLength({ max: 100 }).withMessage('stadium must be at most 100 characters'),

  body('founded')
    .notEmpty().withMessage('founded is required').bail()
    .isInt({ min: 1850, max: currentYear })
    .withMessage(`founded must be a year between 1850 and ${currentYear}`)
    .toInt()
];

// Rule for the :id param
const idRules = () => [
  param('id').isMongoId().withMessage('Invalid club id format')
];

module.exports = { clubRules, idRules, validate };