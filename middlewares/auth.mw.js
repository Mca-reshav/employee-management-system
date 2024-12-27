const { verifyJwt, extractBearerToken } = require("../services/jwt.sv");
const { log } = require("../services/response.sv");
const { message } = require("../services/messages.sv");

module.exports = async (req, res, next) => {
  if (!req.headers["authorization"])
    return res.status(403).json(log(false, message.AUTH_HEADER));
  try {
    const token = extractBearerToken(req.headers["authorization"]),
      verifyJwtData = await verifyJwt(token);

    if (!verifyJwtData.status)
      return res.status(403).json(log(false, message.NOT_VERIFIED));
    req.user = verifyJwtData.jwtData;
    next();
  } catch (error) {
    return res.status(403).json(log(false, message.INTERNAL_ERROR));
  }
};
