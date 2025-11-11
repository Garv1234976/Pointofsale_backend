const express = require("express");
const { uploadCsvProducts } = require("../../controllers/ParserController/controller.productCsvParser");
const upload = require("../../middleware/csvUpload");
const router = express.Router();

router.post(
  "/uploadCsv",
  upload.single("csvFile"),
  uploadCsvProducts
);
module.exports = router;