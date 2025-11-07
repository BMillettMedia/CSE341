// middleware/authCheck.js
module.exports = (req, res, next) => {
  if (req.isAuthenticated && req.isAuthenticated()) return next();
  // For AJAX/API clients we return 401
  res.status(401).json({ error: 'Unauthorized. Please log in.' });
};
