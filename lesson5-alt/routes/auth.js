// routes/auth.js
const express = require('express');
const router = express.Router();
const passport = require('passport');
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcrypt');
const { getDb } = require('../db/connection');

// ---------- Local signup ----------
router.post(
  '/signup',
  [
    body('email').isEmail().withMessage('Valid email required').normalizeEmail(),
    body('password').isLength({ min: 6 }).withMessage('Password min 6 chars'),
    body('displayName').trim().notEmpty().withMessage('displayName required')
  ],
  async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    try {
      const db = getDb();
      const users = db.collection('users');
      const { email, password, displayName } = req.body;
      const existing = await users.findOne({ email: email.toLowerCase() });
      if (existing) return res.status(409).json({ error: 'Email already registered' });

      const passwordHash = await bcrypt.hash(password, 10);
      const newUser = {
        email: email.toLowerCase(),
        displayName,
        passwordHash,
        createdAt: new Date()
      };
      const result = await users.insertOne(newUser);
      // Auto-login after signup
      req.login({ id: result.insertedId.toString(), email: newUser.email, displayName }, (err) => {
        if (err) return next(err);
        return res.status(201).json({ message: 'Account created', id: result.insertedId.toString() });
      });
    } catch (err) { next(err); }
  }
);

// ---------- Local login ----------
router.post(
  '/login',
  [
    body('email').isEmail().withMessage('Valid email required').normalizeEmail(),
    body('password').notEmpty().withMessage('Password required')
  ],
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    passport.authenticate('local', (err, user, info) => {
      if (err) return next(err);
      if (!user) return res.status(401).json({ error: info?.message || 'Authentication failed' });

      req.login(user, (err) => {
        if (err) return next(err);
        return res.json({ message: 'Logged in', user });
      });
    })(req, res, next);
  }
);

// ---------- Google OAuth ----------
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get(
  '/google/callback',
  passport.authenticate('google', { failureRedirect: '/auth/failure' }),
  (req, res) => {
    // Successful login — redirect to client or return JSON if API-only
    res.redirect('/auth/success'); // or res.json({ message: 'Logged in via Google' });
  }
);

router.get('/success', (req, res) => {
  if (!req.isAuthenticated()) return res.status(401).json({ error: 'Not authenticated' });
  res.json({ message: 'Authenticated', user: req.user });
});

router.get('/failure', (req, res) => {
  res.status(401).json({ error: 'Authentication failed' });
});

// ---------- Logout ----------
router.get('/logout', (req, res, next) => {
  req.logout((err) => {
    if (err) return next(err);
    res.json({ message: 'Logged out' });
  });
});

module.exports = router;
