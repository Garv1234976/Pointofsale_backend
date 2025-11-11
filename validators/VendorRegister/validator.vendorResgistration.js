const Joi = require("joi");

const vendorRegistrationSchema = Joi.object({
  email: Joi.string().email().required(),
  phoneNumber: Joi.string()
    .length(10)
    .pattern(/^[0-9]{10}$/)
    .required(),
  password: Joi.string().min(6).required(),
  userName: Joi.string().min(2).required(),
  fullName: Joi.string().allow(""),
});

module.exports = vendorRegistrationSchema;
