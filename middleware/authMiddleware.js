// Middleware 
const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  try {
    const token = req.cookies.auth_token;

    if (!token) {
      return res.status(401).json({ message: "Not authenticated" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = decoded; // attach user ID

    next();
  } catch (error) {
    console.log("Auth Error:", error.message);
    res.status(401).json({ message: "Invalid or expired token" });
  }
};
