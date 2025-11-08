const express = require('express');
const { createVendorProfile, updateVendorProfile, partialUpdateVendorProfile, deleteVendorProfile } = require('../controllers/controller.vendorResgistration');
const upload = require('../middleware/upload')
const router = express.Router();

router.post('/createVendorProfile',upload.single("profileImg") ,createVendorProfile);
router.put('/updateVendorProfile/:id', upload.single('profileImg'), updateVendorProfile);
router.patch('/partialUpdateVendorProfile/:id', upload.single('profileImg'),partialUpdateVendorProfile )
router.delete('/deleteVendorProfile/:id', deleteVendorProfile)
module.exports = router;
