const express = require('express');
const router = express.Router();
const clubsController = require('../controllers/clubs');
const { clubRules, idRules, validate } = require('../validation/clubs');
const { isAuthenticated } = require('../middleware/authenticate');

// Public routes
router.get('/', clubsController.getAll);
router.get('/:id', idRules(), validate, clubsController.getSingle);

// Protected routes (require GitHub login)
router.post('/', isAuthenticated, clubRules(), validate, clubsController.createClub);
router.put('/:id', isAuthenticated, idRules(), clubRules(), validate, clubsController.updateClub);
router.delete('/:id', isAuthenticated, idRules(), validate, clubsController.deleteClub);

module.exports = router;