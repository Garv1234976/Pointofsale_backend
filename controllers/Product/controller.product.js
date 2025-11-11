const Product = require("../../models/Products");
const Vendor = require("../../models/VendorRegistration");
const productCreateSchema = require("../../validators/Product/validator.productCreate");
const productUpdateSchema = require("../../validators/Product/validator.productUpdate");


exports.getAllProducts = async (req, res) => {
  try {
    const products = await Product.find().populate("vendorId");

    res.json({
      count: products.length,
      products,
    });
  } catch (error) {
    console.error("GetAllProducts Error:", error.message);
    res.status(500).json({ error: error.message });
  }
};


exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate("vendorId");

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json(product);
  } catch (error) {
    console.error("GetProductById Error:", error.message);
    res.status(500).json({ error: error.message });
  }
};





exports.createProduct = async (req, res) => {
  try {
    const productsData = req.body.products;
    const files = req.files;

    if (!productsData || !Array.isArray(productsData)) {
      return res.status(400).json({ message: "products must be an array" });
    }

    let saved = 0;
    let failed = 0;
    const results = [];

    for (let i = 0; i < productsData.length; i++) {
      let product = productsData[i];

      // ✅ Find image for the i-th product
      let imageFile = files.find(
        (f) => f.fieldname === `products[${i}][image]`
      );

      try {
        // ✅ Validate each product
        const { error } = productCreateSchema.validate(product);
        if (error) {
          failed++;
          results.push({ index: i, error: error.details[0].message });
          continue;
        }

        // ✅ Ensure vendor exists
        const vendor = await Vendor.findById(product.vendorId);
        if (!vendor) {
          failed++;
          results.push({ index: i, error: "Vendor not found" });
          continue;
        }

        // ✅ Prepare product entry
        const newProduct = new Product({
          ...product,
          inStock: Number(product.inStock || 0),
          expiredAt: product.expiredAt ? new Date(product.expiredAt) : null,
          image: imageFile ? [imageFile.filename] : ["default-product.png"],
        });

        await newProduct.save();
        saved++;

      } catch (err) {
        failed++;
        results.push({ index: i, error: err.message });
      }
    }

    return res.status(201).json({
      message: "Bulk product upload completed",
      saved,
      failed,
      results,
    });

  } catch (error) {
    console.error("BulkCreate Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};




exports.updateProduct = async (req, res) => {
  try {
    const productId = req.params.id;

    // ✅ 1. Validate incoming update fields
    const { error } = productUpdateSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        // message: "Validation failed",
        message: error.details[0].message,
        error: error.details[0].message,
      });
    }

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    let updateData = { ...req.body };

    // ✅ 2. Handle image replacement
    if (req.files && req.files.length > 0) {
      // Delete old images except default
      product.image.forEach((img) => {
        if (img !== "default-product.png") {
          const oldPath = path.join("public/uploads", img);
          if (fs.existsSync(oldPath)) {
            fs.unlinkSync(oldPath);
          }
        }
      });

      updateData.image = req.files.map((file) => file.filename);
    }

    // ✅ 3. Convert date fields if provided
    if (updateData.expiredAt) {
      updateData.expiredAt = new Date(updateData.expiredAt);
    }

    // ✅ 4. Update product in DB
    const updated = await Product.findByIdAndUpdate(productId, updateData, {
      new: true,
      runValidators: true,
    });

    res.json({
      message: "Product updated successfully",
      product: updated,
    });
  } catch (error) {
    console.error("UpdateProduct Error:", error.message);
    res.status(500).json({ error: error.message });
  }
};




exports.partialUpdateProduct = async (req, res) => {
  try {
    const productId = req.params.id;
    let updateData = req.body;

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // ✅ Replace only selected images
    if (req.files && req.files.length > 0) {
      product.image.forEach((img) => {
        if (img !== "default-product.png") {
          const imgPath = path.join("public/uploads", img);
          if (fs.existsSync(imgPath)) fs.unlinkSync(imgPath);
        }
      });

      updateData.image = req.files.map((f) => f.filename);
    }

    // ✅ Parse expiredAt
    if (updateData.expiredAt) {
      updateData.expiredAt = new Date(updateData.expiredAt);
    }

    const updatedProduct = await Product.findByIdAndUpdate(
      productId,
      { $set: updateData },
      { new: true, runValidators: true }
    );

    res.json({
      message: "Product partially updated",
      product: updatedProduct,
    });
  } catch (error) {
    console.error("PartialUpdateProduct Error:", error.message);
    res.status(500).json({ error: error.message });
  }
};




exports.deleteProduct = async (req, res) => {
  try {
    const productId = req.params.id;

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // ✅ delete all product images
    product.image.forEach((img) => {
      if (img !== "default-product.png") {
        const imgPath = path.join("public/uploads", img);
        if (fs.existsSync(imgPath)) fs.unlinkSync(imgPath);
      }
    });

    await Product.findByIdAndDelete(productId);

    res.json({ message: "Product deleted successfully" });
  } catch (error) {
    console.error("DeleteProduct Error:", error.message);
    res.status(500).json({ error: error.message });
  }
};
