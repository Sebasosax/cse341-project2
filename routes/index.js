const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  res.send('Argentine Football API is running');
});

router.use('/players', require('./players'));

module.exports = router;