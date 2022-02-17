const mongoose = require("mongoose");

const bal = mongoose.Schema({
  amount: String,
  message: String,
  userid: String,
});

// creating document
const balS = new mongoose.model("balS", bal);

module.exports = balS;
