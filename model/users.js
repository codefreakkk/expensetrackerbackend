const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");

const bal = mongoose.Schema({
  email: String,
  password: String,
});

bal.methods.generateToken = async function () {
  try {
    const _id = this._id.toString();
    const token = await jwt.sign({ _id }, "codefreak.co.in");
    return token;
  } catch (err) {
    console.log("json err" + err);
  }
};

// creating document
const users = new mongoose.model("users", bal);

module.exports = users;
