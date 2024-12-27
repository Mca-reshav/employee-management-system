const { redisSlug, currentStatus } = require("../../services/constants.sv");
const { message } = require("../../services/messages.sv");
const { findOne, aggregation } = require("../../services/mongo.sv");
const { getDataRedis } = require("../../services/redis.sv");
const { error, success } = require("../../services/response.sv");

module.exports = {
  checkExistingEmp: async (empId) => {
    try {
      if (!empId) return { success: false, reason: "empId required" };

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
              _id: 0, // Exclude the _id field
              userId: 1, // Include userId from EmpEMS
              dept: 1, // Include dept from EmpEMS
              role: "$userDetails.role",
              status: "$userDetails.status",
            },
          },
        ],
      });
      if (check.length != 1) return { success: false, reason: message.EMP.EMP_NOT_EXIST };
      else if (check[0]?.status == currentStatus.INACTIVE)
        return { success: false, reason: message.EMP.INACTIVE_EMP };
      return { success: true, data: { dept: check[0]?.dept, role: check[0]?.role } };
    } catch (err) {
      error(err);
    }
  },

  checkUserRole: async (userId) => {
    try {
      if (!userId) return { success: false, reason: "userId required" };
      const setKey = { key: `${redisSlug.SET}:${userId}` };
      const getRole = await getDataRedis(setKey);

      if (getRole?.role) return { success: true, role: getRole.role };
      return { success: false, reason: message.INTERNAL_ERROR };
    } catch (err) {
      error(err);
    }
  },

  checkMgrDept: async (userId) => {
    try {
      if (!userId) return { success: false, reason: "userId required" };

      const getData = await findOne({
        model: "EmpEMS",
        query: { userId: userId },
        attributes: ["dept"],
      });

      if (getData?.dept) return { success: true, dept: getData.dept };
      return { success: false, reason: message.INTERNAL_ERROR };
    } catch (err) {
      error(err);
    }
  },
};
