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

const vendorStoreCreateSchema = Joi.object({
  storeName: Joi.string().min(2).required(),

  storeCategory: Joi.string()
    .valid(...STORE_CATEGORIES)
    .required(),

  vendorId: Joi.string().required(),

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
    .min(1)
    .required(),

  gstNumber: Joi.string()
    .pattern(gstRegex)
    .allow("")
    .messages({
      "string.pattern.base": "Invalid GST number format (India)",
    }),

  companyName: Joi.string().allow(""),
});

module.exports = vendorStoreCreateSchema;
