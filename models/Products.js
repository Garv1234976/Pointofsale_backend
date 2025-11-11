const mongoose = require("mongoose");

const ProductDetailSchema = new mongoose.Schema(
  {
    // ✅ Reference vendor
    vendorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "VendorProfile",
      required: true,
    },

    mrp: {
      type: String,
      required: true,
    },

    discountPrice: {
      type: String,
      required: true,
    },

    landingPrice: {
      type: String,
      required: true,
    },

    productName: {
      type: String,
      required: true,
      trim: true,
    },

    desc: {
      type: String,
      trim: true,
    },

    // ✅ Default image if vendor doesn’t upload one
    image: {
      type: [String],
      default: ["default-product.png"],
      // will store e.g. "/uploads/default-product.png"
    },

    sku: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    inStock: {
      type: Number,
      default: 0,
    },

    expiredAt: {
      type: Date,
    },

    // ✅ Valid enums for unit type
    unitType: {
      type: String,
      enum: ["piece", "kg", "gram", "litre", "packet", "box"],
      required: true,
    },

    // ✅ Valid enum for weight unit
    weightUnit: {
      type: String,
      enum: ["gram", "kg"],
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Product", ProductDetailSchema);
