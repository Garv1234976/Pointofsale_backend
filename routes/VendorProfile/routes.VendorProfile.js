const express = require("express");
const {
  createVendorProfile,
  updateVendorProfile,
  partialUpdateVendorProfile,
  deleteVendorProfile,
} = require("../../controllers/VendorProfile/controller.vendorResgistration");
const upload = require("../../middleware/upload");
const { route } = require("../Product/routes.products");
const verifyCsrf = require("../../security/verifyCsrf");
const router = express.Router();

router.post(
  "/createVendorProfile",
  upload.single("profileImg"),
  createVendorProfile
);

router
  .route("vendorsCrud/:id")
  .put(verifyCsrf,upload.single("profileImg"), updateVendorProfile)
  .patch(verifyCsrf,upload.single("profileImg"), partialUpdateVendorProfile)
  .delete(verifyCsrf,deleteVendorProfile);
module.exports = router;
