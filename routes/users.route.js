const express = require('express');
const usersRoutes = express.Router();

const mw = require('../middlewares/main.mw');
const { validate, _404, multer, role, webAuth } = mw.one;

usersRoutes.use(mw.global);

const loginController = require('../modules/users/login.controller');
const loginValidator = require('../validators/common/login.validator');
const registerController = require('../modules/users/register.controller');
const registerValidator = require('../validators/common/register.validator');

const usersController = require('../modules/users/users.controller');
const usersValidator = require('../validators/users/users.validator');
const listValidator = require('../validators/common/list.validator');
const { roleDesc } = require('../models/users.md');

usersRoutes.post('/login',validate(loginValidator.login),loginController.login);
usersRoutes.post('/register',validate(registerValidator.register),registerController.register);

usersRoutes.put('/toggle',webAuth,role(roleDesc[1]), validate(usersValidator.toggleStatus),usersController.toggleStatus);
usersRoutes.post('/upload',webAuth,role(roleDesc[1]), multer.single('empList'), usersController.uploadList);
usersRoutes.post('/download',webAuth,role(roleDesc[2]),validate(listValidator.getEmpListToDownload),usersController.downloadList);

usersRoutes.use('**', _404);
module.exports = usersRoutes;