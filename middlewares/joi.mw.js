const { success, log } = require("../services/response.sv");

module.exports = (schema) => {
    return async (req, res, next) => {
        const { error, value } = schema.validate({...req.body,...req.params,...req.query});
        if (error) {
            const messages = error.details.map(detail => detail.message.replace(/\"/g, ''));
            const singleString = messages.join(' '); 
            success(false, singleString)
            return res.status(400).json(log(false, singleString));
        }
        req.validatedData = value;
        next();
    };
};
