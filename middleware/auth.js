const jwt = require("jsonwebtoken");

const authenicate = async (req, res, next) => {
  //authenticate all request before proceeding to the next process

  const token = req.body.token;
  console.log(req.body);
  const verified = jwt.verify(token, process.env.ACCESS, (error, data) => {
    if (error) {
      console.log(error);
      return res.json({ error: "permission denied" });
    }

    const { id } = data;

    //use user data from verified token
    req.user = { id };

    console.log("user data : ", data);

    //continue to the next middleware
    next();
  });
};

module.exports = authenicate;
