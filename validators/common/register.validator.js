const Joi = require("joi");
const { validDept } = require("../../services/constants.sv");
const { roleDesc } = require("../../models/users.md");

exports.register = Joi.object({
  emailId: Joi.string()
    .pattern(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/)
    .required()
    .messages({
      "string.pattern.base": "Invalid email address format.",
      "any.required": "Email address is required.",
    }),
  password: Joi.string().min(8).max(15).required(),
  empName: Joi.string().min(3).max(20).required(),
  contactNo: Joi.string()
    .pattern(/^[6-9]\d{9}$/)
    .required()
    .messages({
      "string.pattern.base":
        "Invalid contact number. It must start with 6-9 and have 10 digits.",
      "any.required": "Contact number is required.",
    }),
  dept: Joi.string()
    .valid(...Object.keys(validDept))
    .required(),
  doj: Joi.date().iso().required(),
  role: Joi.string()
    .valid(...Object.keys(roleDesc))
    .required(),
});
