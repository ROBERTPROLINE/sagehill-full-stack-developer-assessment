const { uniqueID } = require("mocha/lib/utils");
const sequelizeDB = require("./dbconn");
const sequelize = require("sequelize");

/**
 * this model stores the RefreshToken
 * RefreshToken is used to generate a new access token
 */

const Token = sequelizeDB.define("tokens", {
  userid: {
    type: sequelize.STRING,
    allowNull: false,
    unique: true,
  },
  refresh: {
    type: sequelize.STRING,
    allowNull: false,
    unique: true,
  },
});

module.exports = Token;
