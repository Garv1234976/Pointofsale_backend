const Vendor = require('../models/VendorRegistration')
const bcrypt = require("bcrypt");
const { generateToken } = require("../utils/jwt");

exports.loginVendor = async (req, res) => {
  try {
    const { email, password } = req.body;

    // ✅ Validate input
    if (!email || !password) {
      return res.status(400).json({ message: "email and password required" });
    }

    // ✅ Get vendor with password
    const vendor = await Vendor.findOne({ email }).select("+password");
    if (!vendor) {
      return res.status(404).json({ message: "Vendor not found" });
    }

    // ✅ Compare password
    const match = await bcrypt.compare(password, vendor.password);
    if (!match) {
      return res.status(400).json({ message: "Invalid password" });
    }

    // ✅ Generate token
    const token = generateToken({ id: vendor._id });

    // ✅ Set httpOnly cookie
    res.cookie("auth_token", token, {
      httpOnly: true,
      secure: false, // set true in production (HTTPS)
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 1 week
    });

    res.json({
      message: "Login successful",
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
  res.json({ message: "Logged out successfully" });
};
