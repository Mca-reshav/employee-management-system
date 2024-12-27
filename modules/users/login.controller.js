const encryptService = require("../../services/encypt.sv");
const { message } = require("../../services/messages.sv");
const { create, find } = require("../../services/mongo.sv");
const { error, log, success } = require("../../services/response.sv")
const moment = require('moment');

exports.login = async (req, res) => {
    try {
        const { emailId, password } = req.body;
        const getUserId = await find({
            model: 'EmpEMS',
            query: { emailId: emailId},
            attributes: ['userId']
        })
        const userId = getUserId[0]?.userId
        if(!userId) {
            return res.json(log(false, message.USER.REGISTER_PENDING, {}))
        }
        const getData = await find({
            model: 'UserEMS',
            query: {
                userId: userId,
            },
            attributes: ['password','role']
        })
        const checkPwd = await encryptService.comparePassword(password, getData[0].password);
        if (!checkPwd) {
            return res.json(log(false, message.USER.WRONG_PASSWORD, {}))
        }
        success(true, message.USER.LOGGED_IN, {});
        return res.json(log(true, message.USER.LOGGED_IN, {role: getData[0].role, userId}))
    } catch (err) {
        error(err)
    }
}
