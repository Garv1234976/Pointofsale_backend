const jwt = require("jsonwebtoken");

module.exports = function (req, res, next) {
  try {
    const token = req.cookies.auth_token; // read token from cookie

    if (!token) {
      return res.status(401).json({ message: "Unauthorized: No token" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.vendorId = decoded.id; // vendor._id that was stored in the token
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};
