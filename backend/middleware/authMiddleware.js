// backend/middleware/authMiddleware.js
export const protect = (req, res, next) => {
  // Basic example middleware
  const token = req.headers.authorization;
  if (!token) return res.status(401).json({ message: "Not authorized" });
  // Logic to verify token...
  next();
};
