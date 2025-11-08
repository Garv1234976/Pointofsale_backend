const VendorProfile = require("../models/VendorRegistration");
const fs = require("fs");
const path = require("path");
const { generateToken } = require("../utils/jwt");

/**
 *
 * @param {*} req
 * @param {*} res
 */
exports.getAllVendorProfile = async (req, res) => {
  try {
    const vendorProfiles = await VendorProfile.find().populate("vendorId");
    res.json({ count: vendorProfiles.length, vendorProfiles });
  } catch (error) {
    console.log("GetAllVendorProfile Error:", error.message);
    res.status(500).json({ error: error.message });
  }
};

exports.getVendorProfileById = async (req, res) => {
  try {
  } catch (error) {
    console.log("GetVendorById Error:", error.message);
    res.status(500).json({ error: error.message });
  }
};

exports.createVendorProfile = async (req, res) => {
  try {
    const { email, phoneNumber, password, userName, fullname } = req.body;

    if (!email || !phoneNumber || !password || !userName) {
      return res
        .status(400)
        .json({
          message: "email, phoneNumber, password, username are required",
        });
    }

    const checkEmailExists = await VendorProfile.findOne({ email });
    if (checkEmailExists) {
      return res.status(400).json({ message: "Email already registered" });
    }

    const vendorProfileSave = new VendorProfile({
      ...req.body,
      profileImg: req.file ? req?.file?.filename : null,
    });

    await vendorProfileSave.save();
    
    const token = generateToken({id: vendorProfileSave._id})
    res.cookie("auth_token", token, {
      httpOnly: true,
      secure: false, // ✅ change to true in production (HTTPS)
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    res.status(201).json({
      message: "Profile created successfully",
      vendor: {
        id: vendorProfileSave._id,
        email: vendorProfileSave.email,
        userName: vendorProfileSave.userName,
        phoneNumber: vendorProfileSave.phoneNumber,
        fullname: vendorProfileSave.fullName,
        profileImg: vendorProfileSave.profileImg
          ? `/uploads/${vendorProfileSave.profileImg}`
          : null,
      },
    });
  } catch (error) {
    console.log("CreateVendor Error:", error.message);
    res.status(500).json({ error: "Server error. Please try again." });
  }
};

exports.updateVendorProfile = async (req, res) => {
  try {
    const vendorId = req.params.id;
    const updateData = req.body;

    // Check if vendor exists
    const vendor = await VendorProfile.findById(vendorId);
    if (!vendor) {
      return res.status(404).json({ message: "Vendor not found" });
    }

    // Check email uniqueness on update
    if (updateData.email) {
      const emailExists = await VendorProfile.findOne({
        email: updateData.email,
        _id: { $ne: vendorId },
      });

      if (emailExists) {
        return res.status(400).json({ message: "Email already in use" });
      }
    }

    // If new image provided, delete old one and replace
    if (req.file) {
      if (vendor.profileImg) {
        const oldImgPath = path.join("public/uploads", vendor.profileImg);
        if (fs.existsSync(oldImgPath)) {
          fs.unlinkSync(oldImgPath);
        }
      }
      updateData.profileImg = req.file.filename;
    }

    // Overwrite existing data
    await VendorProfile.findByIdAndUpdate(vendorId, updateData, {
      new: true,
      runValidators: true,
    });

    res.json({ message: "Vendor profile updated successfully" });
  } catch (error) {
    console.log("Updating Profile Error", error.message);
    res.status(500).json({ serverError: error.message });
  }
};

exports.partialUpdateVendorProfile = async (req, res) => {
  try {
    const vendorId = req.params.id;
    let updateData = req.body;

    const vendor = await VendorProfile.findById(vendorId);
    if (!vendor) {
      return res.status(404).json({ message: "Vendor not found" });
    }

    // If email is being updated, check uniqueness
    if (updateData.email) {
      const emailExists = await VendorProfile.findOne({
        email: updateData.email,
        _id: { $ne: vendorId },
      });

      if (emailExists) {
        return res.status(400).json({ message: "Email already used" });
      }
    }

    // Handle image replacement
    if (req.file) {
      if (vendor.profileImg) {
        const oldImgPath = path.join("public/uploads", vendor.profileImg);
        if (fs.existsSync(oldImgPath)) fs.unlinkSync(oldImgPath);
      }
      updateData.profileImg = req.file.filename;
    }

    const updatedVendor = await VendorProfile.findByIdAndUpdate(
      vendorId,
      { $set: updateData },
      { new: true, runValidators: true }
    );

    res.json({
      message: "Vendor partially updated",
      vendor: updatedVendor,
    });
  } catch (error) {
    console.log("partial Update Error", error.message);
    res.status(500).json({ serverError: error.message });
  }
};

exports.deleteVendorProfile = async (req, res) => {
  try {
    const vendorId = req.params.id;

    const vendor = await VendorProfile.findById(vendorId);
    if (!vendor) {
      return res.status(404).json({ message: "Vendor not found" });
    }

    // Delete image file
    if (vendor.profileImg) {
      const imgPath = path.join("public/uploads", vendor.profileImg);
      if (fs.existsSync(imgPath)) fs.unlinkSync(imgPath);
    }

    // Delete vendor from database
    await VendorProfile.findByIdAndDelete(vendorId);

    res.json({ message: "Vendor deleted successfully" });
  } catch (error) {
    console.log("delete profile Error", error.message);
    res.status(500).json({ serverError: error.message });
  }
};
