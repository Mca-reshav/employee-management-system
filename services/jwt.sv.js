const { jwtConfig } = require('../config/main.config');
const jwt = require('jsonwebtoken');

// Access token
exports.generateJwt = async (data) => {
    return new Promise(async (resolve, reject) => {
        let jwtData = jwt.sign(data, jwtConfig.access.secretKey, {
            expiresIn :jwtConfig.access.expiresIn,
        });
        resolve({
            status: true,
            token: jwtData
        });
    });
}
exports.verifyJwt = async (token) => {
    return new Promise((resolve, reject) => {
        try {
            let decoded = jwt.verify(token, jwtConfig.access.secretKey);
            resolve({
                status: true,
                jwtData: decoded
            });
        } catch (error) {
            resolve({
                status: false
            });
        }
    });
}
exports.verifyMobileJwt = async (token) => {
    return new Promise((resolve, reject) => {
        try {
            let decoded = jwt.verify(token, jwtConfig.mobile.secretKey);
            resolve({
                status: true,
                jwtData: decoded
            });
        } catch (error) {
            resolve({
                status: false
            });
        }
    });
}
// Mobile access token
exports.generateMobileAccessJwt = async (data) => {
    return new Promise(async (resolve, reject) => {
        let jwtData = jwt.sign(data, jwtConfig.mobile.secretKey, {
            expiresIn: jwtConfig.mobile.expiresIn
        });
        resolve({
            status: true,
            token: jwtData
        });
    });
}

// Refresh token
exports.generateRefreshJwt = async (data) => {
    return new Promise(async (resolve, reject) => {
        let jwtData = jwt.sign(data, jwtConfig.refresh.secretKey, {
            expiresIn: jwtConfig.refresh.expiresIn
        });
        resolve({
            status: true,
            token: jwtData
        });
    });
}
exports.verifyRefreshJwt = async (token) => {
    return new Promise((resolve, reject) => {
        try {
            let decoded = jwt.verify(token, jwtConfig.refresh.secretKey);
            resolve({
                status: true,
                jwtData: decoded
            });
        } catch (error) {
            resolve({
                status: false
            });
        }
    });
}

exports.decodeToken = (token)=>{
    return new Promise((resolve,_)=>{
        try {
            return resolve(jwt.decode(token))
        } catch (error) {
            console.log(error);
            resolve(null);
        }
    })
}

exports.extractBearerToken = (authorizationHeader) => {
    if (authorizationHeader && authorizationHeader.startsWith('Bearer ')) {
        return authorizationHeader.substring(7); // Remove the "Bearer " prefix
    }
    return null; // Return null if the header doesn't contain a bearer token
}
