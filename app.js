const express = require("express");
const mainRouter = require("./routes/main");
const sequelize = require("./database/dbconn");
const path = require("path");
require("dotenv").config();
//initializing express server app
const app = express();

//middleware
app.use(express.json());

//middleware to avoid being blocksed by cors
app.use(function (req, res, next) {
  res.setHeader(
    "Access-Control-Allow-Headers",
    "X-Requested-With,content-type, Accept,Authorization,Origin"
  );
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, OPTIONS, PUT, PATCH, DELETE"
  );
  res.setHeader("Access-Control-Allow-Credentials", true);
  next();
});

app.use("/api/v1/", mainRouter);

//all middleware below serve static files

//home page showing all the notes
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "pages", "index.html"));
});

//login page to gain access to the system
app.get("/login", (req, res) => {
  res.sendFile(path.join(__dirname, "pages", "login.html"));
});

//signup page to create account
app.get("/signup", (req, res) => {
  res.sendFile(path.join(__dirname, "pages", "signup.html"));
});

const start = (async () => {
  //check database availability before starting the server
  const conn = sequelize.authenticate().then(() => {
    console.log("DATABASE CONNECTED");
    app.listen(process.env.PORT || 5000, () => {
      console.log("server started @ ", process.env.PORT);
    });
  });
})();
