const Joi = require('joi');

exports.login = Joi.object({
    emailId: Joi.string().pattern(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/).required(),
    password: Joi.string().min(8).max(15).required()
});