const express = require("express");
const router = express.Router();

const excelUpload = require("../../middleware/excelUpload");
const { uploadExcelProducts } = require("../../controllers/ParserController/controller.productExcelParser");

router.post(
  "/uploadExcel",
  excelUpload.single("excelFile"),
  uploadExcelProducts
);

module.exports = router;
