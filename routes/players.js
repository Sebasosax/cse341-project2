const express = require('express');
const router = express.Router();
const playersController = require('../controllers/players');
const { playerRules, idRules, validate } = require('../validation/players');

router.get('/', playersController.getAll);
router.get('/:id', idRules(), validate, playersController.getSingle);
router.post('/', playerRules(), validate, playersController.createPlayer);
router.put('/:id', idRules(), playerRules(), validate, playersController.updatePlayer);
router.delete('/:id', idRules(), validate, playersController.deletePlayer);

module.exports = router;