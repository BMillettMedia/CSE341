// routes/auth.js
const express = require('express');
const passport = require('passport');
const router = express.Router();

// Step 1: Start the Google login process
router.get(
  '/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

// Step 2: Callback after Google authenticates the user
router.get(
  '/google/callback',
  passport.authenticate('google', { failureRedirect: '/auth/failure' }),
  (req, res) => {
    res.redirect('/auth/success');
  }
);

// Step 3: Success route
router.get('/success', (req, res) => {
  res.send(`✅ Logged in as: ${req.user.displayName}`);
});

// Step 4: Failure route
router.get('/failure', (req, res) => {
  res.send('❌ Failed to log in with Google');
});

// Step 5: Logout
router.get('/logout', (req, res) => {
  req.logout(() => {
    res.redirect('/');
  });
});

module.exports = router;
