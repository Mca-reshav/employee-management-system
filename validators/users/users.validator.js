const Joi = require('joi');

exports.toggleStatus = Joi.object({
    userId: Joi.string().required(),
    empId: Joi.string().required()
});