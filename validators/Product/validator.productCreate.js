const Joi = require("joi");

const UNIT_TYPES = ["piece", "kg", "gram", "litre", "packet", "box"];
const WEIGHT_UNITS = ["gram", "kg"];

const productCreateSchema = Joi.object({
  vendorId: Joi.string().required(),

  mrp: Joi.number().required(),
  discountPrice: Joi.number().required(),
  landingPrice: Joi.number().required(),

  productName: Joi.string().min(2).required(),
  desc: Joi.string().allow("").optional(),

  sku: Joi.string().required(),

  inStock: Joi.number().default(0),

  expiredAt: Joi.date().allow(null).optional(),

  unitType: Joi.string()
    .valid(...UNIT_TYPES)
    .required(),

  weightUnit: Joi.string()
    .valid(...WEIGHT_UNITS)
    .required(),
});

module.exports = productCreateSchema;
