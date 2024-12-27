const { roleDesc } = require("../../models/users.md");
const { createdBy, updatePermission, redisSlug } = require("../../services/constants.sv");
const { encodeUserId } = require("../../services/encode_decode.sv");
const encryptService = require("../../services/encypt.sv");
const { message } = require("../../services/messages.sv");
const {
  create,
  find,
  updateOne,
  aggregation,
} = require("../../services/mongo.sv");
const { error, log, success } = require("../../services/response.sv");
const moment = require("moment");
const {
  checkExistingEmp,
  checkMgrDept,
  checkUserRole,
} = require("./employees.service");
const { sendNotification } = require("../../services/notification.sv");
const { getAggregated } = require("../../services/aggregator.sv");
const { updateDataRedis } = require("../../services/redis.sv");

exports.addEmp = async (req, res) => {
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
          createdBy: createdBy.ADMIN,
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

      const msg = userEntry ? message.EMP.ADD : message.FAILED;
      success(userEntry, msg, {});
      return res.json(log(userEntry, msg, {}));
    }
  } catch (err) {
    error(err);
  }
};

exports.updateEmp = async (req, res) => {
  try {
    const { empId, doj } = req.body;
    const userId = req.user.userId;
    if (userId == empId) return res.json(log(false, message.EMP.NOT_SELF));
    if (doj) {
      const checkDate = doj && !moment(doj).isValid();
      if (checkDate) return res.json(log(false, message.INVALID_DATE, {}));
    }
    const checkExist = await checkExistingEmp(empId);
    if (!checkExist.success) return res.json(log(false, checkExist.reason));

    const getEmpRole = checkExist.data.role;
    const getEmpDept = checkExist.data.dept;
    const getUserRole = req.user.role;

    const permissible = updatePermission[roleDesc[getUserRole]];
    const isPermissible = permissible.includes(getEmpRole);
    if (!isPermissible)
      return res.json(log(false, message.EMP.NOT_PERMISSIBLE));

    //User: Manager role
    const checkMgr = roleDesc[2] == roleDesc[getUserRole];
    if (checkMgr) {
      const checkDept = (await checkMgrDept(userId)).dept;

      if (checkDept != getEmpDept)
        return res.json(log(false, message.EMP.DEPT_NOT_MATCHED));
    }
    const updateData = await updateFilteredData(checkMgr, req.body);
    if (updateData.success) return res.json(log(true, message.EMP.UPDATE));
    return res.json(log(false, updateData.reason));
  } catch (err) {
    error(err);
  }
};

exports.getEmp = async (req, res) => {
  try {
    const empId = req.body.empId;

    const check = await aggregation({
      model: "EmpEMS",
      query: [
        {
          $match: {
            userId: empId,
          },
        },
        {
          $lookup: {
            from: "userems",
            localField: "userId",
            foreignField: "userId",
            as: "userDetails",
          },
        },
        {
          $unwind: "$userDetails",
        },
        {
          $project: {
            _id: 0,
            empName: 1,
            emailId: 1,
            contactNo: 1,
            dept: 1,
            role: "$userDetails.role",
            status: "$userDetails.status",
          },
        },
      ],
    });

    if (check.length != 1)
      return res.json(log(false, message.EMP.EMP_NOT_EXIST, check));
    return res.json(log(true, message.EMP.GET, check));
  } catch (err) {
    error(err);
  }
};

exports.getEmpList = async (req, res) => {
  try {
    const { page, limit } = req.body;
    const getData = await getAggregated(page, limit);
    return res.json(log(true, message.EMP.GETALL, getData));
  } catch (err) {
    error(err);
  }
};

const updateFilteredData = async (isMgr, obj) => {
  const empId = obj?.empId;
  delete obj.empId;

  const filteredObj = Object.fromEntries(
    Object.entries(obj).filter(
      ([key, val]) => val != undefined && key != "role"
    )
  );

  const updateEmpData = await updateOne({
    model: "EmpEMS",
    query: { userId: empId },
    data: filteredObj,
  });

  let isRoleUpdated;
  if (!isMgr) {
    const updateUserData = await updateOne({
      model: "UserEMS",
      query: { userId: empId },
      data: { role: obj.role },
    });

    isRoleUpdated = updateUserData?.modifiedCount == 1;
  }
  const isUpdated = updateEmpData?.modifiedCount == 1;
  if (!isUpdated) return { success: false, reason: message.FAILED };
  else if (isUpdated && isMgr) {
    sendNotification(empId, message.SOCKET.UPDATE);
    return { success: true };
  } else if (isUpdated && !isMgr && isRoleUpdated) {
    const redisObj = {
      key: `${redisSlug.SET}:${empId}`,
      value: { role: obj.role},
      expire: 900
    };
    await updateDataRedis(redisObj)
    sendNotification(empId, message.SOCKET.ROLE);
    return { success: true };
  } else return { success: false, reason: message.INTERNAL_ERROR };
};