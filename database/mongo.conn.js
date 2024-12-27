const mongoose = require("mongoose");
const { mongoDB } = require("../config/main.config");
const { success, error } = require("../services/response.sv");

mongoose
  .connect(`${mongoDB.protocol}://${mongoDB.host}`, {
    dbName: mongoDB.database,
    user: mongoDB.username,
    pass: mongoDB.password,
  })
  .then(() => success(true, "MONGODB"))
  .catch((err) => {
    success(false, "MONGODB CONNECTION");
    error(err);
  });

  module.exports = {
    mongoose
};