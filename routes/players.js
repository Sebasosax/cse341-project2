const express = require('express');
const router = express.Router();
const playersController = require('../controllers/players');

router.get('/', playersController.getAll);
router.get('/:id', playersController.getSingle);
router.post('/', playersController.createPlayer);

module.exports = router;