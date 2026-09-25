const express = require('express');
const router = express.Router();
const playersController = require('../controllers/players');

router.get('/', playersController.getAll);
router.get('/:id', playersController.getSingle);
router.post('/', playersController.createPlayer);
router.put('/:id', playersController.updatePlayer);
router.delete('/:id', playersController.deletePlayer);

module.exports = router;