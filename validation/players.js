const { body, param, validationResult } = require('express-validator');

const POSITIONS = ['Goalkeeper', 'Defender', 'Midfielder', 'Winger', 'Forward'];

// Rules for the player body (used by POST and PUT)
const playerRules = () => [
  body('firstName')
    .trim()
    .notEmpty().withMessage('firstName is required').bail()
    .isLength({ min: 2, max: 50 }).withMessage('firstName must be 2-50 characters'),

  body('lastName')
    .trim()
    .notEmpty().withMessage('lastName is required').bail()
    .isLength({ min: 2, max: 50 }).withMessage('lastName must be 2-50 characters'),

  body('position')
    .trim()
    .notEmpty().withMessage('position is required').bail()
    .isIn(POSITIONS).withMessage(`position must be one of: ${POSITIONS.join(', ')}`),

  body('jerseyNumber')
    .notEmpty().withMessage('jerseyNumber is required').bail()
    .isInt({ min: 1, max: 99 }).withMessage('jerseyNumber must be an integer between 1 and 99')
    .toInt(),

  body('birthDate')
    .notEmpty().withMessage('birthDate is required').bail()
    .isISO8601({ strict: true }).withMessage('birthDate must be a valid date (YYYY-MM-DD)').bail()
    .custom((value) => {
      if (new Date(value) > new Date()) {
        throw new Error('birthDate cannot be in the future');
      }
      return true;
    }),

  body('birthPlace')
    .trim()
    .notEmpty().withMessage('birthPlace is required').bail()
    .isLength({ max: 100 }).withMessage('birthPlace must be at most 100 characters'),

  body('currentClub')
    .trim()
    .notEmpty().withMessage('currentClub is required').bail()
    .isLength({ max: 100 }).withMessage('currentClub must be at most 100 characters'),

  body('internationalCaps')
    .notEmpty().withMessage('internationalCaps is required').bail()
    .isInt({ min: 0 }).withMessage('internationalCaps must be a non-negative integer')
    .toInt(),

  body('internationalGoals')
    .notEmpty().withMessage('internationalGoals is required').bail()
    .isInt({ min: 0 }).withMessage('internationalGoals must be a non-negative integer')
    .toInt(),

  body('worldCupWinner')
    .exists().withMessage('worldCupWinner is required').bail()
    .isBoolean({ strict: true }).withMessage('worldCupWinner must be true or false')
    .toBoolean(true)
];

// Rule for the :id param
const idRules = () => [
  param('id').isMongoId().withMessage('Invalid player id format')
];

// Middleware that returns 400 with all errors if validation fails
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

module.exports = { playerRules, idRules, validate };