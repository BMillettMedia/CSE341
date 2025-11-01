// routes/auth.js
const express = require('express');
const passport = require('passport');
const router = express.Router();

// Start the login process
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

// Handle Google callback
router.get(
  '/google/callback',
  passport.authenticate('google', {
    failureRedirect: '/auth/failure',
    successRedirect: '/auth/success'
  })
);

// Logout route
router.get('/logout', (req, res) => {
  req.logout(() => {
    res.redirect('/');
  });
});

// Simple test routes
router.get('/success', (req, res) => {
  res.send('✅ Logged in successfully!');
});

router.get('/failure', (req, res) => {
  res.send('❌ Login failed.');
});

module.exports = router;
