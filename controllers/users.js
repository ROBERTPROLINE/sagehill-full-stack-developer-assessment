const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const sequelize = require("../database/dbconn");
const User = require("../database/user");
const Token = require("../database/token");
const { v4: uuid } = require("uuid");

const login = async (req, res) => {
  //login requires email and password from the request body
  const { email, password } = req.body;

  if (!email || !password)
    return res.json({ error: "email/password required" });
  sequelize
    .sync()
    .then(() => {
      User.findOne({
        where: {
          email: email,
        },
      })
        .then(async (response) => {
          //check password
          if (!response) return res.json({ error: "user not found" });

          const validPassword = await bcrypt.compare(
            password,
            response.password
          );

          console.log("user logged in");

          if (validPassword) {
            //if password is valid generate access and refresh tokens
            tokens = await GenerateToken(response.userid);
            console.log(tokens);
            req.user = { tokens, id: response.id };

            console.log(tokens);
            res.status(200).json(tokens);
            //save the refresh token in database
            //await SaveToken(req, res);
            //res.json(tokens);
          } else {
            return res.json({ error: "wrong email/password combination" });
          }
        })
        .catch((error) => {
          console.error("Failed to retrieve data : ", error);
        });
    })
    .catch((error) => {
      console.error("Unable to create table : ", error);
    });
};

const signup = async (req, res) => {
  //get user details fro request body

  const { fullname, email, password } = req.body;

  if (!fullname || !email || !password)
    return res.json({ error: "fullname/email/password required" });

  //email
  sequelize.sync().then(() => {
    User.findOne({
      where: {
        email: email,
      },
    }).then(async (response) => {
      if (!response) {
        const hashdPassword = await bcrypt.hash(password, 10);
        User.create({
          userid: uuid(),
          email: email,
          fullname: fullname,
          password: hashdPassword,
        })
          .then((response) => {
            res.json({ success: `user created for ${email}` });
          })
          .catch((err) => {
            res.json({ error: err });
          });
      } else {
        return res.json({ error: "email already taken" });
      }
    });
  });
};

const RefreshToken = async (req, res, next) => {
  //token sent through request body
  const { token } = req.body;

  if (!token) return res.json({ error: "token requierd" });
  const verified = jwt.verify(
    token,
    process.env.REFRESH,
    async (error, data) => {
      if (error) return res.json({ error: "access denied" });

      //check if token exist in database
      //token might be valid but it might not be the current token -> user requested another token
      //if token exists in database the move to next middleware
      next();
    }
  );
};

const GenerateToken = async (data) => {
  //sign both access token and refresh token

  //access token is used to gain access to the app
  const accessToken = await jwt.sign({ id: data }, process.env.ACCESS, {
    expiresIn: "30d",
  });

  //refreshToken is used to get a new access token
  const refreshToken = await jwt.sign({ data }, process.env.REFRESH, {
    expiresIn: "30d",
  });

  return { refresh: refreshToken, acces: accessToken };
};

const SaveToken = async (req, res) => {
  res.json(req.tokens);

  sequelize.sync().then(() => {
    User.findOne({
      where: {
        userid: req.user.id,
      },
    }).then((response) => {
      if (!response || response.length === 0) {
        //insert new token
        Token.create({
          userid: req.user.id,
          refresh: req.user.tokens.refresh,
        });
      } else {
        //update old token
        //Token.f;
        Token.destory({
          where: {
            userid: req.user.id,
          },
        }).then(() => {
          Token.create({
            userid: req.user.id,
            refresh: req.user.tokens.refresh,
          });
        });
      }
    });
  });
};

module.exports = {
  login,
  signup,
  RefreshToken,
};
