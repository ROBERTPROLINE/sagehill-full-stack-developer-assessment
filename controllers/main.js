const sequelize = require("../database/dbconn");
const { v4: uuid } = require("uuid");
const Note = require("../database/notes");

/**
 * this file contains all the login of notes-based routes
 * each middleware is unique
 *user details are passed through the request object -> from authentication middleware
 */

const searchNotes = async (req, res) => {
  /**
   * search notes by title
   * the search string is provided through the request body
   */

  sequelize.sync().then(() => {
    //get all the notes by user
    Note.findAll({
      where: {
        userid: req.user.id,
      },
    }).then((data) => {
      if (!data) res.json({ error: "no data found" });
      let results = [];
      data.forEach((element) => {
        //filter the notes based on title

        if (element.title.includes(req.body.string)) {
          results.push(element);
        }
      });
      res.json({ notes: results });
    });
  });
};

const getAllNotes = async (req, res) => {
  //get all notes belonging to the user

  sequelize.sync().then(() => {
    Note.findAll({
      where: {
        userid: req.user.id,
      },
    }).then((data) => {
      if (!data) res.json({ error: "no data found" });
      res.json({ notes: data });
    });
  });
};

const createNote = async (req, res) => {
  //create a new notes
  const { title, content } = req.body;
  if (!title || !content)
    return res.json({ error: "title & content required" });

  sequelize.sync().then(() => {
    Note.findAll({
      where: {
        title: title,
        userid: req.user.id,
      },
    })
      .then((response) => {
        console.log(response);
        if (!response || response.length === 0) {
          Note.create({
            userid: req.user.id,
            title,
            content,
          }).then((response) => {
            res.json({ done: "new note added" });
          });
        } else {
          res.json({ error: "title already taken" });
        }
      })
      .catch((err) => {
        console.log(err);
        res.json({ error: err });
      });
  });
};

const getNote = async (req, res) => {
  const { id } = req.params;

  //get a notes based on id

  sequelize.sync().then(() => {
    Note.findOne({
      where: {
        id: id,
      },
    }).then((data) => {
      if (!data || data === undefined)
        res.staus(404).json({ error: "No data found" });
      res.json({ note: data });
    });
  });
};

const updateNote = async (req, res, next) => {
  //update note using request body
  const { id } = req.params;
  const { title, content } = req.body;

  if (!title || !content)
    return res.json({ error: "title and content are required" });

  sequelize.sync().then(() => {
    Note.update(
      {
        title: title,
        content: content,
      },
      {
        where: {
          id: id,
        },
      }
    )
      .then(() => {
        return res.json({ done: "updated" });
      })
      .catch((err) => {
        console.log(err);
        return res.json({ error: err });
      });
  });
};

const deleteNote = async (req, res, next) => {
  //delete note from database using request params
  const { id } = req.params;
  sequelize.sync().then(() => {
    Note.destroy({
      where: {
        id: id,
      },
    })
      .then(() => {
        res.json({ done: "deleted" });
      })
      .catch((err) => {
        console.log(err);
        res.json({ error: err });
      });
  });
};

module.exports = {
  getAllNotes,
  searchNotes,
  createNote,
  getNote,
  updateNote,
  deleteNote,
};
