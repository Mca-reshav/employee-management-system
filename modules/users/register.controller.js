const { encodeUserId } = require("../../services/encode_decode.sv");
const encryptService = require("../../services/encypt.sv");
const { generateJwt } = require("../../services/jwt.sv");
const { message } = require("../../services/messages.sv");
const { create, find } = require("../../services/mongo.sv");
const { error, log, success, tokenLog } = require("../../services/response.sv");
const moment = require("moment");

exports.register = async (req, res) => {
  try {
    const { emailId, contactNo, empName, dept, doj, role, password } = req.body;
    const checkDate = doj && !moment(doj).isValid();
    if (checkDate) return res.json(log(false, message.INVALID_DATE, {}));

    const userId = await encodeUserId(contactNo, emailId);
    const isExist = await find({
      model: "EmpEMS",
      query: {
        $or: [{ contactNo: contactNo }, { emailId: emailId }],
      },
      attributes: ["userId"],
    });

    const newUser = isExist.length == 0;
    if (!newUser) {
      return res.json(log(false, message.USER.ALREADY_EXIST, {}));
    } else {
      const encPwd = await encryptService.hashPassword(password);
      const empEntry = await create({
        model: "EmpEMS",
        data: {
          userId: userId,
          empName: empName,
          emailId: emailId,
          contactNo: contactNo,
          dept: dept,
          doj: doj,
        },
      });

      if (!empEntry) {
        success(empEntry, message.FAILED, {});
        return res.json(log(empEntry, message.FAILED, {}));
      }
      const userEntry = await create({
        model: "UserEMS",
        data: {
          userId: userId,
          role: role,
          password: encPwd,
        },
      });

      const msg = userEntry ? message.USER.REGISTER_DONE : message.FAILED;
      const getToken = await generateJwt({userId, role})
        tokenLog(getToken.token)
      success(userEntry, msg);
      return res.json(log(true, msg, {}));
    }
  } catch (err) {
    error(err);
  }
};
