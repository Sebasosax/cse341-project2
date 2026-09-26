// Blocks the request with 401 if the user is not logged in
const isAuthenticated = (req, res, next) => {
  if (req.isAuthenticated && req.isAuthenticated()) {
    return next();
  }
  return res.status(401).json({ message: 'You must be logged in to access this route' });
};

module.exports = { isAuthenticated };