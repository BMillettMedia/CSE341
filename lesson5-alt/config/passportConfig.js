// config/passportConfig.js
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const bcrypt = require('bcrypt');
const { getDb } = require('../db/connection');

// ---- Local Strategy (email/password) ----
passport.use(
  new LocalStrategy(
    { usernameField: 'email', passwordField: 'password' },
    async (email, password, done) => {
      try {
        const db = getDb();
        const user = await db.collection('users').findOne({ email: email.toLowerCase() });
        if (!user) return done(null, false, { message: 'Incorrect email or password' });

        const match = await bcrypt.compare(password, user.passwordHash);
        if (!match) return done(null, false, { message: 'Incorrect email or password' });

        // Don't return passwordHash
        return done(null, { id: user._id.toString(), email: user.email, displayName: user.displayName });
      } catch (err) {
        return done(err);
      }
    }
  )
);

// ---- Google Strategy ----
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: '/auth/google/callback'
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const db = getDb();
        const users = db.collection('users');
        // Try to find existing user by google id
        let user = await users.findOne({ 'google.id': profile.id });
        if (!user) {
          // if not found, create a new user entry
          const newUser = {
            displayName: profile.displayName,
            email: (profile.emails && profile.emails[0] && profile.emails[0].value) || null,
            google: { id: profile.id, provider: 'google' },
            createdAt: new Date()
          };
          const result = await users.insertOne(newUser);
          user = { ...newUser, _id: result.insertedId };
        }
        return done(null, { id: user._id.toString(), email: user.email, displayName: user.displayName });
      } catch (err) {
        return done(err);
      }
    }
  )
);

// ---- Sessions: serialize / deserialize ----
passport.serializeUser((user, done) => {
  // user must be small (just id)
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const db = getDb();
    const user = await db.collection('users').findOne({ _id: new (require('mongodb').ObjectId)(id) });
    if (!user) return done(null, false);
    done(null, { id: user._id.toString(), email: user.email, displayName: user.displayName });
  } catch (err) {
    done(err);
  }
});
