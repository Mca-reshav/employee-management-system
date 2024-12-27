const express = require('express');

module.exports.global = [
    express.json(), // parse json post response,
    express.urlencoded({extended:true}),
    require('./cors.mw')
];


module.exports.one = {
    authentication : (req,res,next)=>{},
    validate : require('./joi.mw'),
    webAuth: require('./auth.mw'),
    webRegAuth: require('./reg.mw'),
    _404 : require('./404.mw'),
    multer : require('./multer.mw'),
    role : require('./role.mw')
}