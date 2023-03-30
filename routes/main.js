const router = require("express").Router();
const { route } = require("express/lib/router");
/**
 * all the routes are inside this file
 */

//routes associated with notes app
const {
  getAllNotes,
  searchNotes,
  getNote,
  createNote,
  updateNote,
  deleteNote,
} = require("../controllers/main");

//authentication middleware to authenticate users on all requests
const auth = require("../middleware/auth");

const { login, signup, RefreshToken } = require("../controllers/users");

router.route("/notes").post(auth, getAllNotes);
router.route("/search").post(auth, searchNotes);
router.route("").post(auth, createNote);

router.route("/notes/:id").post(auth, getNote);

router
  .route("/:id")
  .patch(auth, updateNote, getNote)
  .delete(auth, deleteNote, getAllNotes);

//routes associated with user management
router.route("/login").post(login);

router.route("/signup").post(signup);

module.exports = router;
