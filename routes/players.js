const express = require('express');
const router = express.Router();
const playersController = require('../controllers/players');
const { playerRules, idRules, validate } = require('../validation/players');
const { isAuthenticated } = require('../middleware/authenticate');

// Public routes
router.get('/', playersController.getAll);
router.get('/:id', idRules(), validate, playersController.getSingle);

// Protected routes (require GitHub login)
router.post('/', isAuthenticated, playerRules(), validate, playersController.createPlayer);
router.put('/:id', isAuthenticated, idRules(), playerRules(), validate, playersController.updatePlayer);
router.delete('/:id', isAuthenticated, idRules(), validate, playersController.deletePlayer);

module.exports = router;