const express = require('express');
const router = express.Router();
const upload = require('../middleware/upload');
const { createVendorStore, getAllVendorStores, getVendorStoreById, updateVendorStore, partialUpdateVendorStore, deleteVendorStore } = require('../controllers/controller.vendorStore');

router.post("/createVendorStore", upload.single("storeLogo"), createVendorStore);
router.get("/getAllVendorStores", getAllVendorStores);
router.get("/getVendorStoreById/:id", getVendorStoreById);
router.put("/updateVendorStore/:id", upload.single("storeLogo"), updateVendorStore);
router.patch("/partialUpdateVendorStore/:id", upload.single("storeLogo"), partialUpdateVendorStore);
router.delete("/deleteVendorStore/:id", deleteVendorStore);

module.exports = router;
