const mysql = require("mysql");

//database connection
const Sequelize = require("sequelize");
const sequelize = new Sequelize("sagehill2", "root", "", {
  host: "localhost",
  dialect: "mysql",
});

module.exports = sequelize;
