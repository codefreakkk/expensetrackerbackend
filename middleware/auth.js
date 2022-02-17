const jwt = require("jsonwebtoken");
const users = require("../model/users");

const auth = async (req, res, next) => {
  try {
    const token = req.cookies.jwt;
    const verify = jwt.verify(token, "codefreak.co.in");
    console.log(verify);
    const user = await users.findOne({ _id: verify._id });
    req.user = user;
    req.token = token;
    next();
  } catch (err) {
    console.log("Auth err " + err);
  }
};
