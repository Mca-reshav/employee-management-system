const Joi = require('joi');
const { validDept } = require('../../services/constants.sv');
const { roleDesc } = require('../../models/users.md');

exports.addEmp = Joi.object({
    emailId: Joi.string().pattern(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/).required(),
    empName: Joi.string().min(3).max(20).required(),
    contactNo: Joi.string().pattern(/^[6-9]\d{9}$/).required(),
    dept: Joi.string().valid(...Object.keys(validDept)).required(),
    doj: Joi.date().iso().required(),
    role: Joi.string().valid(...Object.keys(roleDesc)).required(),
    password: Joi.string().min(8).max(15).required(),
});

exports.updateEmp = Joi.object({
    userId: Joi.string().required(),
    empId: Joi.string().required(),
    emailId: Joi.string().pattern(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/).optional(),
    empName: Joi.string().min(3).max(20).optional(),
    contactNo: Joi.string().pattern(/^[6-9]\d{9}$/).optional(),
    dept: Joi.string().valid(...Object.keys(validDept)).optional(),
    doj: Joi.date().iso().optional(),
    role: Joi.string().valid(...Object.keys(roleDesc)).optional()
});

exports.getEmp = Joi.object({
    userId: Joi.string().required(),
    empId: Joi.string().required(),
});