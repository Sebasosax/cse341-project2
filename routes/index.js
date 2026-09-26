const express = require('express');
const passport = require('passport');
const router = express.Router();

router.get('/', (req, res) => {
  // #swagger.ignore = true
  if (req.isAuthenticated()) {
    const name = req.user.displayName || req.user.username;
    return res.send(`Argentine Football API is running. Logged in as ${name}. <a href="/logout">Logout</a>`);
  }
  res.send('Argentine Football API is running. Logged out. <a href="/login">Login with GitHub</a>');
});

// Start GitHub OAuth flow
router.get('/login', passport.authenticate('github', { scope: ['user:email'] }));

// GitHub redirects here after the user authorizes the app
router.get(
  '/github/callback',
  passport.authenticate('github', { failureRedirect: '/api-docs', session: true }),
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