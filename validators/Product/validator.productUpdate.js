const Joi = require("joi");

const UNIT_TYPES = ["piece", "kg", "gram", "litre", "packet", "box"];
const WEIGHT_UNITS = ["gram", "kg"];

const productUpdateSchema = Joi.object({
  mrp: Joi.number().optional(),
  discountPrice: Joi.number().optional(),
  landingPrice: Joi.number().optional(),

  productName: Joi.string().min(2).optional(),
  desc: Joi.string().allow("").optional(),

  sku: Joi.string().optional(),

  inStock: Joi.number().optional(),

  expiredAt: Joi.date().allow(null).optional(),

  unitType: Joi.string()
    .valid(...UNIT_TYPES)
    .optional(),

  weightUnit: Joi.string()
    .valid(...WEIGHT_UNITS)
    .optional(),
}).min(1); 
// ✅ ensures at least ONE field must be updated

module.exports = productUpdateSchema;
