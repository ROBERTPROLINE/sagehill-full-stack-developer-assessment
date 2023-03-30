const { uniqueID } = require("mocha/lib/utils");
const sequelizeDB = require("./dbconn");
const sequelize = require("sequelize");

/**
 * this files contains the User model
 * use has userid and email that are unique
 */
const User = sequelizeDB.define("user", {
  userid: {
    type: sequelize.STRING,
    allowNull: false,
    unique: true,
  },
  email: {
    type: sequelize.STRING,
    allowNull: false,
    unique: true,
  },
  fullname: {
    type: sequelize.STRING,
    allowNull: false,
  },
  password: {
    type: sequelize.STRING,
    allowNull: false,
  },
});

module.exports = User;
