const VendorProfile = require("../../models/VendorRegistration");
const fs = require("fs");
const path = require("path");
const { generateToken } = require("../../utils/jwt");
const validateVendorRegistration = require('../../validators/VendorRegister/validator.vendorResgistration');
const vendorUpdateSchema = require("../../validators/VendorRegister/validator.vendorUpdate");
const { generateCsrfToken } = require("../../security/csrf");

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
    // ✅ Validate input with Joi FIRST
    const { error } = validateVendorRegistration.validate(req.body);

    if (error) {
      return res.status(400).json({
        // message: "Validation failed",
        message: error.details[0].message,
        error: error.details[0].message,
      });
    }

    const { email } = req.body;

    const checkEmailExists = await VendorProfile.findOne({ email });
    if (checkEmailExists) {
      return res.status(400).json({ message: "Email already registered" });
    }

    // ✅ Create Vendor
    const vendorProfileSave = new VendorProfile({
      ...req.body,
      profileImg: req.file ? req.file.filename : null,
    });

    await vendorProfileSave.save();

    // ✅ Generate JWT token
    const token = generateToken({ id: vendorProfileSave._id });

    // ✅ Generate CSRF token
    const csrfToken = generateCsrfToken();

    // ✅ Set JWT cookie
    res.cookie("auth_token", token, {
      httpOnly: true,
      secure: false,  // set true in prod
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    // ✅ Set CSRF cookie (Readable by frontend)
    res.cookie("csrf_token", csrfToken, {
      httpOnly: false,    // ✅ frontend can read it
      secure: false,      // ✅ true in production
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    // ✅ Response
    res.status(201).json({
      message: "Profile created successfully",
      csrfToken, // optional, helps frontend store it immediately
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
// exports.createVendorProfile = async (req, res) => {
//   try {
//     // const { email, phoneNumber, password, userName, fullname } = req.body;
//     const {error} = validateVendorRegistration.validate(req.body);

//     if(error){
//       return res.status(400).json({
//         message: "Validation failed",
//         error: error.details[0].message,
//       });
//     }
//     // if (!email || !phoneNumber || !password || !userName) {
//     //   return res
//     //     .status(400)
//     //     .json({
//     //       message: "email, phoneNumber, password, username are required",
//     //     });
//     // }

//     const checkEmailExists = await VendorProfile.findOne({ email });
//     if (checkEmailExists) {
//       return res.status(400).json({ message: "Email already registered" });
//     }

//     const vendorProfileSave = new VendorProfile({
//       ...req.body,
//       profileImg: req.file ? req?.file?.filename : null,
//     });

//     await vendorProfileSave.save();
    
//     const token = generateToken({id: vendorProfileSave._id})
//     res.cookie("auth_token", token, {
//       httpOnly: true,
//       secure: false, // ✅ change to true in production (HTTPS)
//       sameSite: "lax",
//       maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
//     });

//     res.status(201).json({
//       message: "Profile created successfully",
//       vendor: {
//         id: vendorProfileSave._id,
//         email: vendorProfileSave.email,
//         userName: vendorProfileSave.userName,
//         phoneNumber: vendorProfileSave.phoneNumber,
//         fullname: vendorProfileSave.fullName,
//         profileImg: vendorProfileSave.profileImg
//           ? `/uploads/${vendorProfileSave.profileImg}`
//           : null,
//       },
//     });
//   } catch (error) {
//     console.log("CreateVendor Error:", error.message);
//     res.status(500).json({ error: "Server error. Please try again." });
//   }
// };



exports.updateVendorProfile = async (req, res) => {
  try {
    const { error } = vendorUpdateSchema.validate(req.body);

    if (error) {
      return res.status(400).json({
        // message: "Validation failed",
        message: error.details[0].message,
        error: error.details[0].message,
      });
    }

    const updatedVendor = await VendorProfile.findByIdAndUpdate(
      req.params.id,
      {
        ...req.body,
        profileImg: req.file ? req.file.filename : undefined,
      },
      { new: true, runValidators: true }
    );

    if (!updatedVendor) {
      return res.status(404).json({ message: "Vendor not found" });
    }

    res.json({
      message: "Profile updated successfully",
      vendor: updatedVendor,
    });

  } catch (error) {
    console.log("UpdateVendor Error:", error.message);
    res.status(500).json({ error: error.message });
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
