module.exports = function verifyCsrf(req, res, next) {
  const csrfCookie = req.cookies?.csrf_token;
  const csrfHeader = req.headers["csrf_token"];

  if (!csrfCookie) {
    return res.status(403).json({ message: "Missing CSRF cookie" });
  }

  if (!csrfHeader) {
    return res.status(403).json({ message: "Missing CSRF token" });
  }

  if (csrfCookie !== csrfHeader) {
    return res.status(403).json({ message: "Invalid CSRF token" });
  }

  next();
};
