const express = require('express');
const router = express.Router();
const clubsController = require('../controllers/clubs');
const { clubRules, idRules, validate } = require('../validation/clubs');

router.get('/', clubsController.getAll);
router.get('/:id', idRules(), validate, clubsController.getSingle);
router.post('/', clubRules(), validate, clubsController.createClub);
router.put('/:id', idRules(), clubRules(), validate, clubsController.updateClub);
router.delete('/:id', idRules(), validate, clubsController.deleteClub);

module.exports = router;