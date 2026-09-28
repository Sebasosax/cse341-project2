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
router.get(
  '/login',
  (req, res, next) => {
    /*
      #swagger.tags = ['Authentication']
      #swagger.summary = 'Log in with GitHub'
      #swagger.description = 'Redirects to GitHub to authorize the app. Open this URL directly in a new browser tab (Try it out cannot follow the GitHub redirect). On first login a user account is created in the users collection.'
      #swagger.responses[302] = { description: 'Redirect to GitHub authorization page' }
    */
    next();
  },
  passport.authenticate('github', { scope: ['user:email'] })
);

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
  /*
    #swagger.tags = ['Authentication']
    #swagger.summary = 'Log out'
    #swagger.description = 'Ends the session and redirects to the home page. Open this URL directly in the browser.'
    #swagger.responses[302] = { description: 'Redirect to home page after logout' }
  */
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