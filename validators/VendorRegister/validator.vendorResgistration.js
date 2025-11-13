const Joi = require("joi");

const vendorRegistrationSchema = Joi.object({
  email: Joi.string().email().required(),

  phoneNumber: Joi.string()
    .length(10)
    .pattern(/^[0-9]{10}$/)
    .required(),

  // ✔ Password must be at least 8 characters
  password: Joi.string()
    .min(8)
    .required()
    .messages({
      "string.min": "Password must be at least 8 characters long",
    }),

  // ✔ Username: alphabets only
  userName: Joi.string()
    .pattern(/^[A-Za-z]+$/)
    .required()
    .messages({
      "string.pattern.base": "Username should contain alphabets only",
    }),

  // ✔ Full name: alphabets + spaces allowed
  fullName: Joi.string()
    .pattern(/^[A-Za-z ]+$/)
    .required()
    .messages({
      "string.pattern.base": "Full name should contain alphabets only",
    }),
});

module.exports = vendorRegistrationSchema;
