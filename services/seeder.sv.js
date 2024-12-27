const { encodeUserId } = require("../services/encode_decode.sv");
const encryptService = require("../services/encypt.sv");
const { error, success,log } = require("./response.sv");
const { upsert } = require("./mongo.sv");
const { message } = require("./messages.sv");
const moment = require("moment");
const { createdBy } = require("./constants.sv");

exports.seedData = async (data = []) => {
  try {
    const rawDataAry = [];
    for (let i = 0; i < data.length; i++) {
      const obj = JSON.parse(JSON.stringify(data[i]));
      const userId = await encodeUserId(obj["Contact"], obj["Email"]);
      const encPwd = await encryptService.hashPassword(obj["Password"]);

      const empParsedRow = {
        userId: userId,
        empName: obj["Name"],
        emailId: obj["Email"],
        contactNo: obj["Contact"],
        dept: obj["Department"],
        doj: moment(obj["DoJ"], "DD/MM/YYYY").format("YYYY-MM-DD"),
        createdBy: createdBy.ADMIN
      };

      const usersParsedRow = {
        userId: userId,
        role: obj["Role"],
        password: encPwd,
      };
      
      rawDataAry.push([empParsedRow, usersParsedRow]);
    }
    const uploadLog = {
      success: [],
      failure: [],
    };
    if (rawDataAry.length > 0) {
      for (let i = 0; i < rawDataAry.length; i++) {
        let empData = rawDataAry[i][0];
        let usersData = rawDataAry[i][1];

        const upsertEmp = await upsert({
          model: "EmpEMS",
          data: { ...empData },
          query: { userId: empData.userId },
        });
        if (upsertEmp?._id) {
          success(true, message.EMP.SEED);

          const upsertUsers = await upsert({
            model: "UserEMS",
            data: { ...usersData },
            query: { userId: usersData.userId },
          });
          if (upsertUsers?._id) {
            uploadLog.success.push(usersData.userId);
            success(true, message.USER.SEED);
          }
        } else {
          uploadLog.failure.push(empData.userId);
          success(false, message.EMP.SEED_FAILURE);
        }
      }
      return (log(true, '', uploadLog))
    }
    return (log(false));
  } catch (err) {
    error(err);
  }
};
