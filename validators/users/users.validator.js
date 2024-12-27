const Joi = require('joi');

exports.toggleStatus = Joi.object({
    empId: Joi.string().required()
});