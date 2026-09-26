const express = require('express');
const passport = require('passport');
const { renderHome } = require('../views/home');
const router = express.Router();

router.get('/', (req, res) => {
  // #swagger.ignore = true
  const user = req.isAuthenticated() ? req.user : null;
  res.send(renderHome(user));
});

// Start GitHub OAuth flow
router.get('/login', passport.authenticate('github', { scope: ['user:email'] }));

// GitHub redirects here after the user authorizes the app
router.get(
  '/github/callback',
  passport.authenticate('github', { failureRedirect: '/', session: true }),
  (req, res) => {
    // #swagger.ignore = true
    res.redirect('/api-docs');
  }
);

// End the session
router.get('/logout', (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    req.session.destroy(() => {
      res.clearCookie('connect.sid');
      res.redirect('/');
    });
  });
});

router.use('/players', require('./players'));
router.use('/clubs', require('./clubs'));

module.exports = router;