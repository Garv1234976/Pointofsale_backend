const Joi = require("joi");

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

const gstRegex = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z][1-9A-Z]Z[0-9A-Z]$/;

const vendorStoreUpdateSchema = Joi.object({
  storeName: Joi.string().min(2).optional(),

  storeCategory: Joi.string()
    .valid(...STORE_CATEGORIES)
    .optional(),

  storeAddress: Joi.array()
    .items(
      Joi.object({
        localArea: Joi.string().allow(""),
        city: Joi.string().allow(""),
        state: Joi.string().allow(""),
        pincode: Joi.string()
          .pattern(/^[1-9][0-9]{5}$/)
          .message("Invalid pincode"),
      })
    )
    .optional(),

  gstNumber: Joi.string()
    .pattern(gstRegex)
    .allow("")
    .messages({
      "string.pattern.base": "Invalid GST number format (India)",
    }),

  companyName: Joi.string().allow(""),
})
  .min(1); // ✅ At least one field must be updated

module.exports = vendorStoreUpdateSchema;
