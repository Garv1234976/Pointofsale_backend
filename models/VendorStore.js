const mongoose = require("mongoose");

// ✅ Indian GST Format Regex
const gstRegex = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z][1-9A-Z]Z[0-9A-Z]$/;

// ✅ Define enum categories
const STORE_CATEGORIES = [
  "grocery",
  "electronics",
  "fashion",
  "restaurant",
  "pharmacy",
  "hardware",
  "books",
  "cosmetics",
  "others"
];

const VendorStoreSchema = new mongoose.Schema(
  {
    storeName: {
      type: String,
      required: true,
      trim: true,
    },

    storeCategory: {
      type: String,
      enum: STORE_CATEGORIES,
      required: true,
    },

    storeAddress: [
      {
        localArea: { type: String, trim: true },
        city: { type: String, trim: true },
        state: { type: String, trim: true },
        pincode: {
          type: String,
          validate: {
            validator: (v) => /^[1-9][0-9]{5}$/.test(v),
            message: "Invalid pincode format",
          },
        },
      },
    ],

    // ✅ Vendor reference
    vendorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Vendor",
      required: true,
    },

    // ✅ Store logo image filename (multer)
    storeLogo: {
      type: String,
      default: null,
    },

    gstNumber: {
      type: String,
      trim: true,
      validate: {
        validator: (v) => gstRegex.test(v),
        message: "Invalid GST number format (India)",
      },
    },

    companyName: {
      type: String,
      trim: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("VendorStore", VendorStoreSchema);
