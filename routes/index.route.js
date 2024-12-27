require('dotenv').config();
const express = require('express');
const app = express();

const usersRoutes = require('./users.route');
const empRoutes = require('./emp.route');
app.use('/users',usersRoutes);
app.use('/emp',empRoutes);
module.exports = app;