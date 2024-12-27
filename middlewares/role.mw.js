const { rolesPermission, redisSlug, currentStatus } = require("../services/constants.sv");
const { message } = require("../services/messages.sv");
const { findOne } = require("../services/mongo.sv");
const { getDataRedis, setDataRedis } = require("../services/redis.sv");
const { log } = require("../services/response.sv");

module.exports = (role) => {
  return async (req, res, next) => {
    const userId = req.query.userId;
    if (!userId) return res.status(400).json(log(false, message.USERID_REQ));

    const key = `${redisSlug.SET}:${userId}`;
    let getRole = "";
    const getData = await getDataRedis({ key: key });
    if (getData) getRole = getData?.role;
    else {
      const checkRole = await findOne({
        model: "UserEMS",
        query: { userId: userId, status: currentStatus.ACTIVE },
        attributes: ["role"],
      });
      if (!checkRole?.role)
        return res.status(400).json(log(false, message.ROLE_NOT_FOUND));
      getRole = checkRole?.role;
      const obj = {
        key: key,
        value: { role: getRole },
        expire: 900,
      };
      await setDataRedis(obj);
    }
    if (rolesPermission[role].includes(getRole)) next();
    else return res.status(400).json(log(false, message.UNAUTH));
  };
};