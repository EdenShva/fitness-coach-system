// middleware/roleMiddleware.js
// Ensures that the logged-in user has the required role (e.g. "coach")

const roleMiddleware = (requiredRole) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: "no user in request" });
    }
    if (req.user.role !== requiredRole) {
      return res.status(403).json({
        message: "Access denied",
        userRole: req.user.role,
        requiredRole,
      });
    }
    next();
  };
};

module.exports = roleMiddleware;
