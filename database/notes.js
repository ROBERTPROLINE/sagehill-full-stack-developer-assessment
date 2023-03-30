const { uniqueID } = require("mocha/lib/utils");
const sequelizeDB = require("./dbconn");
const sequelize = require("sequelize");

/**
 * this is the notes model
 * notes has userid, who is the owner of the note
 */

const Note = sequelizeDB.define("notes", {
  userid: {
    type: sequelize.STRING,
    allowNull: false,
  },
  title: {
    type: sequelize.STRING,
    allowNull: false,
  },
  content: {
    type: sequelize.STRING,
    allowNull: false,
  },
});

module.exports = Note;
