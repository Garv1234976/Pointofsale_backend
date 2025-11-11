const Joi = require("joi");

const vendorUpdateSchema = Joi.object({
  email: Joi.string().email().optional(),
  phoneNumber: Joi.string().length(10).pattern(/^[0-9]{10}$/).optional(),
  password: Joi.string().min(6).optional(),
  userName: Joi.string().min(2).optional(),
  fullName: Joi.string().optional(),
}).min(1); 

module.exports = vendorUpdateSchema;
