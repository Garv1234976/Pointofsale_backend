const express = require('express');
const router = express.Router();
const authVendor = require('../../middleware/authVendor');
const Vendor = require('../../models/VendorRegistration')


router.get("/me", authVendor, async (req, res) => {
  try {
    const vendor = await Vendor.findById(req.vendorId).select("-password").populate('storeId');

    if (!vendor) {
      return res.status(404).json({ message: "Vendor not found" });
    }

    res.status(200).json({ vendor });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;