const roleCheck = (allowedRoles = []) => {
  return (req, res, next) => {
    const role = req.headers["x-user-role"] || req.body.role || req.query.role;
    if (!role || !allowedRoles.includes(role)) {
      return res.status(403).json({ message: "Access denied" });
    }
    return next();
  };
};

module.exports = roleCheck;
