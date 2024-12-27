const Joi = require("joi");

const fileType = Object.freeze({
  1: "CSV",
  2: "EXCEL",
});

exports.getEmpList = Joi.object({
  userId: Joi.string().required(),
  page: Joi.number().optional(),
  limit: Joi.number().optional()
});

exports.getEmpListToDownload = Joi.object({
  userId: Joi.string().required(),
  page: Joi.number().optional(),
  limit: Joi.number().optional(),
  fileType: Joi.string()
    .valid(...Object.keys(fileType))
    .required()
    .messages({
      "any.only": `fileType : '1' -> csv, '2' -> excel`,
      "any.required": "fileType is a required field",
    }),
});
