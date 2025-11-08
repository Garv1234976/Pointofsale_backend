const express = require("express");
const { loginVendor, logoutVendor } = require("../controllers/controller.auth");
const router = express.Router();



router.post("/login", loginVendor);
router.post("/logout", logoutVendor);

module.exports = router;