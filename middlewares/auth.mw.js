const { verifyJwt ,extractBearerToken} = require("../services/jwt.sv");

module.exports = async (req, res, next) => {
    if(req.headers['authorization'] != undefined && req.headers['authorization'] != '') {
        try{
            let token = extractBearerToken(req.headers['authorization']);
            let verifyJwtData = await verifyJwt(token);
            if(verifyJwtData.status == true) {
                if(verifyJwtData.jwtData.customerId)  verifyJwtData.jwtData.customerId = verifyJwtData.jwtData.customerId+'';
                req.user = verifyJwtData.jwtData;
                next();
            } else {
                return res.status(403).json({
                    message: 'You are not authorized !'
                });
            }
        } catch (error) {
            return res.status(403).json({
                message: 'You are not authorized !'
            });
        }
    } else {
        return res.status(403).json({
            message: 'You are not authorized !'
        });
    }
}