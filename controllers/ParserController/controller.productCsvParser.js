const fs = require("fs");
const { parse } = require("csv-parse");
const Product = require("../../models/Products");
const Vendor = require("../../models/VendorRegistration");

exports.uploadCsvProducts = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "CSV file is required" });
    }

    const vendorId = req.body.vendorId;
    if (!vendorId) {
      return res.status(400).json({ message: "vendorId is required" });
    }

    // Validate vendor
    const vendorExists = await Vendor.findById(vendorId);
    if (!vendorExists) {
      return res.status(404).json({ message: "Vendor not found" });
    }

    const filePath = req.file.path;

    const validProducts = [];
    const errors = [];

    let line = 1; // header = line 1

    const parser = fs
      .createReadStream(filePath)
      .pipe(
        parse({
          columns: true,
          trim: true,
          skip_empty_lines: true,
        })
      );

    parser.on("data", (row) => {
      line++;

      // ✅ Validate required fields
      if (
        !row.mrp ||
        !row.discountPrice ||
        !row.landingPrice ||
        !row.productName ||
        !row.sku ||
        !row.unitType ||
        !row.weightUnit
      ) {
        errors.push({
          line,
          row,
          error: "Missing required fields",
        });
        return; 
      }

      // ✅ Validate enum fields
      const allowedUnit = ["piece", "kg", "gram", "litre", "packet", "box"];
      const allowedWeight = ["gram", "kg"];

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

      // ✅ Passed all validation
      validProducts.push({
        vendorId,
        mrp: row.mrp,
        discountPrice: row.discountPrice,
        landingPrice: row.landingPrice,
        productName: row.productName,
        desc: row.desc,
        sku: row.sku,
        inStock: row.inStock ? Number(row.inStock) : 0,
        expiredAt: row.expiredAt ? new Date(row.expiredAt) : null,
        unitType: row.unitType,
        weightUnit: row.weightUnit,
        image: ["default-product.png"],
      });
    });

    parser.on("end", async () => {
      try {
        let inserted = [];

        if (validProducts.length > 0) {
          inserted = await Product.insertMany(validProducts, { ordered: false });
        }

        fs.unlinkSync(filePath); // ✅ cleanup

        res.status(201).json({
          message: "CSV processed",
          insertedCount: inserted.length,
          failedCount: errors.length,
          errors,
        });
      } catch (err) {
        console.log("Insert Many Error:", err.message);
        res.status(500).json({ message: "Insert error", error: err.message });
      }
    });

    parser.on("error", (err) => {
      console.error("CSV Parse Error:", err.message);
      res.status(400).json({ message: "CSV parse failed", error: err.message });
    });
  } catch (error) {
    console.log("uploadCsvProducts Error:", error.message);
    res.status(500).json({ error: error.message });
  }
};
