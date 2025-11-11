const fs = require("fs");
const XLSX = require("xlsx");
const Product = require("../../models/Products");
const Vendor = require("../../models/VendorRegistration");

exports.uploadExcelProducts = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "Excel file is required" });
    }

    const vendorId = req.body.vendorId;

    if (!vendorId) {
      return res.status(400).json({ message: "vendorId is required" });
    }

    const vendorExists = await Vendor.findById(vendorId);
    if (!vendorExists) {
      return res.status(404).json({ message: "Vendor not found" });
    }

    const filePath = req.file.path;

    // ✅ Read Excel file
    const workbook = XLSX.readFile(filePath);
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const rows = XLSX.utils.sheet_to_json(sheet);

    const validProducts = [];
    const errors = [];
    let line = 1;

    const allowedUnit = ["piece", "kg", "gram", "litre", "packet", "box"];
    const allowedWeight = ["gram", "kg"];

    rows.forEach((row) => {
      line++;

      // ✅ Check required fields
      if (
        !row.mrp ||
        !row.discountPrice ||
        !row.landingPrice ||
        !row.productName ||
        !row.sku ||
        !row.unitType ||
        !row.weightUnit
      ) {
        errors.push({ line, row, error: "Missing required fields" });
        return;
      }

      // ✅ Validate Enums
      if (!allowedUnit.includes(row.unitType)) {
        errors.push({
          line,
          row,
          error: `Invalid unitType: ${row.unitType}`,
        });
        return;
      }

      if (!allowedWeight.includes(row.weightUnit)) {
        errors.push({
          line,
          row,
          error: `Invalid weightUnit: ${row.weightUnit}`,
        });
        return;
      }

      // ✅ row is valid
      validProducts.push({
        vendorId,
        mrp: row.mrp,
        discountPrice: row.discountPrice,
        landingPrice: row.landingPrice,
        productName: row.productName,
        desc: row.desc || "",
        sku: row.sku,
        inStock: row.inStock ? Number(row.inStock) : 0,
        expiredAt: row.expiredAt ? new Date(row.expiredAt) : null,
        weightUnit: row.weightUnit,
        unitType: row.unitType,
        image: ["default-product.png"],
      });
    });

    let inserted = [];

    if (validProducts.length > 0) {
      inserted = await Product.insertMany(validProducts, { ordered: false });
    }

    fs.unlinkSync(filePath); // ✅ Remove Excel temp file

    res.status(201).json({
      message: "Excel processed successfully",
      insertedCount: inserted.length,
      failedCount: errors.length,
      errors,
    });
  } catch (error) {
    console.log("uploadExcelProducts Error:", error.message);
    res.status(500).json({ error: error.message });
  }
};
