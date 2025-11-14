require("dotenv").config();
const Vendor = require('../../models/VendorRegistration')
const bcrypt = require("bcrypt");
const { generateToken } = require("../../utils/jwt");
const {generateCsrfToken} = require('../../security/csrf')
exports.loginVendor = async (req, res) => {
  try {
    const { email, password } = req.body;

    // ✅ Validate input
    if (!email || !password) {
      return res.status(400).json({ message: "email and password required" });
    }

    // ✅ Find vendor & select password
    const vendor = await Vendor.findOne({ email }).select("+password");
    if (!vendor) {
      return res.status(404).json({ message: "Vendor not found" });
    }

    // ✅ Compare password
    const match = await bcrypt.compare(password, vendor.password);
    if (!match) {
      return res.status(400).json({ message: "Invalid password" });
    }

    // ✅ Generate JWT token
    const token = generateToken({ id: vendor._id });

    // ✅ Generate CSRF token
    const csrfToken = generateCsrfToken();

    // ✅ Set auth cookie (httpOnly)
    res.cookie("auth_token", token, {
      httpOnly: false,
      secure: false,   // ✅ true in production
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    // ✅ Set CSRF cookie
    res.cookie("csrf_token", csrfToken, {
      httpOnly: false,   // ✅ frontend can read
      secure: false,
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    // ✅ Successful response
    res.json({
      message: "Login successful",
      csrfToken, // ✅ Optional: helps frontend store immediately
      vendor: {
        id: vendor._id,
        email: vendor.email,
        userName: vendor.userName,
      },
    });

  } catch (error) {
    console.log("Login Error:", error.message);
    res.status(500).json({ error: "Server error" });
  }
};
exports.logoutVendor = async (req, res) => {
  res.clearCookie("auth_token");
  res.clearCookie("csrf_token");
  res.json({ message: "Logged out successfully" });
};
