const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET || "eco_sync_secret";

const roleCheck = (allowedRoles = []) => {
  return (req, res, next) => {
    const authHeader = req.headers.authorization || "";
    const token = authHeader.startsWith("Bearer ")
      ? authHeader.slice(7)
      : null;
    if (!token) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    try {
      const payload = jwt.verify(token, JWT_SECRET);
      req.user = payload;
      if (allowedRoles.length && !allowedRoles.includes(payload.role)) {
        return res.status(403).json({ message: "Access denied" });
      }
      return next();
    } catch (error) {
      return res.status(401).json({ message: "Unauthorized" });
    }
  };
};

module.exports = roleCheck;
