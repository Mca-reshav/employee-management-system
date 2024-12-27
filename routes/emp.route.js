const express = require('express');
const empRoutes = express.Router();

const mw = require('../middlewares/main.mw');
const {validate, _404, role, webAuth} = mw.one;

empRoutes.use(mw.global);

const empController = require('../modules/emp/employees.controller');
const empValidator = require('../validators/emp/employees.validator');
const listValidator = require('../validators/common/list.validator');
const { roleDesc } = require('../models/users.md');

empRoutes.post('/add', webAuth, role(roleDesc[1]) ,validate(empValidator.addEmp), empController.addEmp)
empRoutes.put('/update', webAuth, role(roleDesc[2]),validate(empValidator.updateEmp), empController.updateEmp)
empRoutes.get('/get', webAuth, role(roleDesc[3]), validate(empValidator.getEmp),empController.getEmp)
empRoutes.get('/getList', webAuth, role(roleDesc[2]),validate(listValidator.getEmpList), empController.getEmpList)

empRoutes.use('**', _404);
module.exports = empRoutes;