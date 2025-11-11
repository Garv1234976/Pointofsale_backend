const express = require("express");
const router = express.Router();
const upload = require("../../middleware/upload");
const {
  createVendorStore,
  getAllVendorStores,
  getVendorStoreById,
  updateVendorStore,
  partialUpdateVendorStore,
  deleteVendorStore,
} = require("../../controllers/VendorStore/controller.vendorStore");
const verifyCsrf = require("../../security/verifyCsrf");

router.post(
  "/createVendorStore",
  verifyCsrf,
  upload.single("storeLogo"),
  createVendorStore
);
router.get("/getAllVendorStores", getAllVendorStores);
router.get("/getVendorStoreById/:id", getVendorStoreById);

router
  .route("/vendorStoreCrud/:id")
  .put(verifyCsrf,upload.single("storeLogo"), updateVendorStore)
  .patch(verifyCsrf,upload.single("storeLogo"), partialUpdateVendorStore)
  .delete(verifyCsrf,deleteVendorStore);

module.exports = router;
